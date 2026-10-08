/**
 * DREAM CART BD — PRODUCT SERVICE
 * Multi-Vendor Product Master + Seller Offer Architecture.
 * Fast paginated reads, caching, variant generation, image indexing.
 */

var ProductService = {
  getPublicProducts: function(params) {
    params = params || {};
    var page = parseInt(params.page, 10) || 1;
    var limit = parseInt(params.limit, 10) || 20;
    var category = params.category;
    var brand = params.brand;
    var search = params.search ? String(params.search).toLowerCase().trim() : null;
    var sellerId = params.seller_id;

    var cacheKey = "pub_prods_" + (category || "all") + "_" + (brand || "all") + "_" + page + "_" + limit;
    if (!search && !sellerId) {
      var cached = AppCacheService.get(cacheKey);
      if (cached) return cached;
    }

    var allProducts = SheetRepository.getAllRows(CONFIG.SHEETS.PRODUCTS);
    var allOffers = SheetRepository.getAllRows(CONFIG.SHEETS.PRODUCT_OFFERS);
    var allImages = SheetRepository.getAllRows(CONFIG.SHEETS.IMAGES);

    // Filter active & approved products
    var filtered = allProducts.filter(function(p) {
      var status = String(p.status || "active").toLowerCase();
      var approval = String(p.approval_status || "approved").toLowerCase();
      var visibility = String(p.visibility || "public").toLowerCase();

      if (status !== "active" || approval !== "approved" || visibility !== "public") return false;
      if (category && String(p.category_id).toLowerCase() !== String(category).toLowerCase()) return false;
      if (brand && String(p.brand_id).toLowerCase() !== String(brand).toLowerCase()) return false;
      
      if (search) {
        var nameMatch = String(p.product_name || "").toLowerCase().indexOf(search) !== -1;
        var skuMatch = String(p.sku || "").toLowerCase().indexOf(search) !== -1;
        var tagMatch = String(p.tags || "").toLowerCase().indexOf(search) !== -1;
        if (!nameMatch && !skuMatch && !tagMatch) return false;
      }
      return true;
    });

    var total = filtered.length;
    var startIndex = (page - 1) * limit;
    var paged = filtered.slice(startIndex, startIndex + limit);

    // Map lightweight fields for high speed listing
    var items = paged.map(function(p) {
      // Find primary image
      var img = allImages.find(function(i) {
        return i.product_id === p.product_id && (i.is_primary === true || String(i.is_primary).toLowerCase() === "true" || i.is_primary === 1);
      });
      if (!img) {
        img = allImages.find(function(i) { return i.product_id === p.product_id; });
      }

      // Find best active seller offer
      var offers = allOffers.filter(function(o) {
        return o.product_id === p.product_id && String(o.status || "active").toLowerCase() === "active";
      });

      var activePrice = parseFloat(p.selling_price) || 0;
      var regularPrice = parseFloat(p.regular_price) || (activePrice * 1.25);
      var discountPercent = regularPrice > activePrice ? Math.round(((regularPrice - activePrice) / regularPrice) * 100) : 0;

      return {
        product_id: p.product_id,
        name: p.product_name,
        slug: p.slug || (p.product_name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sku: p.sku || p.product_id,
        category_id: p.category_id,
        brand_id: p.brand_id,
        selling_price: activePrice,
        regular_price: regularPrice,
        discount_percent: discountPercent,
        wholesale_price: parseFloat(p.wholesale_price) || (activePrice * 0.85),
        reseller_price: parseFloat(p.reseller_price) || (activePrice * 0.90),
        thumbnail: img ? (img.thumbnail_url || img.image_url) : "https://placehold.co/400x400/png?text=Dream+Cart+BD",
        stock_status: (parseInt(p.available_stock, 10) || 10) > 0 ? "in_stock" : "out_of_stock",
        available_stock: parseInt(p.available_stock, 10) || 10,
        rating: parseFloat(p.rating) || 4.8,
        reviews_count: parseInt(p.reviews_count, 10) || 12,
        seller_id: p.seller_id || "DCBD-OFFICIAL",
        seller_name: p.seller_name || "Dream Cart BD Official"
      };
    });

    var response = {
      items: items,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        total_pages: Math.ceil(total / limit)
      }
    };

    if (!search && !sellerId) {
      AppCacheService.set(cacheKey, response, CONFIG.CACHE_TTL_SECONDS);
    }
    return response;
  },

  getProductDetails: function(identifier) {
    var allProducts = SheetRepository.getAllRows(CONFIG.SHEETS.PRODUCTS);
    var p = allProducts.find(function(item) {
      return item.product_id === identifier || item.slug === identifier || item.sku === identifier;
    });

    if (!p) return null;

    var allVariants = SheetRepository.getAllRows(CONFIG.SHEETS.VARIANTS);
    var allImages = SheetRepository.getAllRows(CONFIG.SHEETS.IMAGES);
    var allOffers = SheetRepository.getAllRows(CONFIG.SHEETS.PRODUCT_OFFERS);

    var variants = allVariants.filter(function(v) { return v.product_id === p.product_id; });
    var images = allImages.filter(function(img) { return img.product_id === p.product_id; });
    var offers = allOffers.filter(function(off) { return off.product_id === p.product_id; });

    return {
      product_id: p.product_id,
      name: p.product_name,
      slug: p.slug,
      sku: p.sku,
      category_id: p.category_id,
      brand_id: p.brand_id,
      short_description: p.short_description || "",
      description: p.description || "",
      selling_price: parseFloat(p.selling_price) || 0,
      regular_price: parseFloat(p.regular_price) || (parseFloat(p.selling_price) * 1.25),
      reseller_price: parseFloat(p.reseller_price) || 0,
      wholesale_price: parseFloat(p.wholesale_price) || 0,
      wholesale_moq: parseInt(p.wholesale_moq, 10) || 5,
      stock_type: p.stock_type || "PHYSICAL",
      available_stock: parseInt(p.available_stock, 10) || 10,
      variants: variants,
      images: images,
      offers: offers,
      seller_id: p.seller_id || "DCBD-OFFICIAL",
      seller_name: p.seller_name || "Dream Cart BD Official",
      warranty: p.warranty || "7 Days Replacement Warranty",
      delivery_charge: {
        inside_dhaka: 60,
        outside_dhaka: 120
      }
    };
  },

  createProduct: function(session, payload) {
    if (!session) throw new Error("Unauthorized");
    
    var productId = IDGenerator.productID();
    var isVendor = session.role === CONFIG.ROLES.SELLER;
    var approvalStatus = isVendor ? "pending" : "approved";

    var newProduct = {
      product_id: productId,
      seller_id: session.role === CONFIG.ROLES.SELLER ? session.user_id : (payload.seller_id || "DCBD-OFFICIAL"),
      created_by: session.user_id,
      approved_by: isVendor ? "" : session.user_id,
      product_name: Validator.sanitizeString(payload.name),
      slug: (payload.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + productId.toLowerCase().slice(-4),
      sku: payload.sku || productId,
      category_id: payload.category_id || "CAT-GENERAL",
      brand_id: payload.brand_id || "BRD-GENERAL",
      short_description: payload.short_description || "",
      description: payload.description || "",
      status: "active",
      visibility: "public",
      approval_status: approvalStatus,
      selling_price: parseFloat(payload.selling_price) || 0,
      regular_price: parseFloat(payload.regular_price) || 0,
      purchase_price: parseFloat(payload.purchase_price) || 0,
      reseller_price: parseFloat(payload.reseller_price) || 0,
      wholesale_price: parseFloat(payload.wholesale_price) || 0,
      wholesale_moq: parseInt(payload.wholesale_moq, 10) || 1,
      stock_type: "PHYSICAL",
      physical_stock: parseInt(payload.stock, 10) || 0,
      available_stock: parseInt(payload.stock, 10) || 0,
      reserved_stock: 0,
      damaged_stock: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    SheetRepository.appendRow(CONFIG.SHEETS.PRODUCTS, newProduct);

    // Save images
    if (payload.images && Array.isArray(payload.images)) {
      var imageRows = [];
      for (var i = 0; i < payload.images.length; i++) {
        var imgItem = payload.images[i];
        imageRows.push({
          image_id: IDGenerator.generate("IMG"),
          product_id: productId,
          variant_id: "",
          image_url: imgItem.url,
          thumbnail_url: imgItem.thumbnail_url || imgItem.url,
          sort_order: i + 1,
          is_primary: i === 0
        });
      }
      SheetRepository.appendRowsBatch(CONFIG.SHEETS.IMAGES, imageRows);
    }

    // Invalidate product catalog cache
    AppCacheService.invalidateGroup("pub_prods");
    AuditService.log(session.user_id, session.role, "PRODUCT_CREATE", "Products", productId, { name: newProduct.product_name });

    return {
      success: true,
      product_id: productId,
      message: "Product created successfully." + (isVendor ? " Awaiting admin approval." : "")
    };
  }
};

if (typeof module !== 'undefined') {
  module.exports = ProductService;
}
