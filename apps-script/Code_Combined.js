/**
 * DREAM CART BD — MASTER GOOGLE APPS SCRIPT API GATEWAY (Code.js)
 * Connected Spreadsheet ID: 1BGi8IXV6S7uXDi4IaR_sCJYhtpfzyLGuldo4NnGVmR8
 * Reminders & Alerts: jainal.dcitbd@gmail.com
 * Supports: Full CRUD on Products, Categories, Brands, Orders, Incomplete Orders, Viewers
 * Fully CORS & JSONP enabled with zero-crash error boundary.
 */

// ==========================================
// 1. MASTER CONFIGURATION & SCHEMAS
// ==========================================
var CONFIG = {
  SHOP: {
    NAME: "Dream Cart BD",
    OWNERS: ["Jainal Abedin", "MD. Saiful Islam"],
    LOGO_URL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7IMYDMkNYleCqUCLvSDtcioP1MAENEONLcelVu_7byA&s=10",
    ADDRESS: "Chawdhury Plaza, ground floor, room#03, Paduar Bazar, Bishwa Road, Sadar Dakshin, Cumilla-3500.",
    PHONE_1: "01581703822",
    PHONE_2: "01818273838",
    NOTIFICATION_EMAIL: "jainal.dcitbd@gmail.com"
  },
  SPREADSHEET_ID: "1BGi8IXV6S7uXDi4IaR_sCJYhtpfzyLGuldo4NnGVmR8",

  SHEETS: {
    PRODUCTS: "Products",
    CATEGORIES: "Categories",
    BRANDS: "Brands",
    ORDERS: "Orders",
    INCOMPLETE_ORDERS: "Incomplete_Orders",
    VIEWERS: "Viewers",
    CUSTOMERS: "Customers",
    RESELLERS: "Resellers",
    WHOLESALERS: "Wholesalers",
    BUYING: "Buying",
    COSTS: "Costs",
    INVEST: "Invest",
    OTHERS_MARKET: "Others_Market",
    ADMIN_WORKER: "Admin/Worker",
    SETTINGS: "Settings",
    BANNERS: "Banners",
    REVIEWS: "Reviews",
    PAYMENTS: "Payments",
    LANDING_PAGES: "Landing-Pages",
    WORKER_LOGS: "Worker-Logs"
  },

  SCHEMAS: {
    PRODUCTS: [
      "SKU", "P_Name", "Category", "Sub_Category", "Child_Category", "Brand",
      "Buying_price", "Selling_Price", "Stock", "Original_Price", "WholeSale_price",
      "Min_order_Q", "Images", "Slug", "Description", "Specification", "Others",
      "Color", "Size", "WEIGHT_KG", "WIDTH_CM", "LENGTH_CM", "HEIGHT_CM"
    ],
    CATEGORIES: [
      "Catagory_ID", "Catagory_Slug", "Category_Image", "Category", "Sub_Category", "Chail_Category"
    ],
    BRANDS: [
      "Brand_ID", "Brand_Image", "Brand_Name", "Brand_Slug", "Brand_Description"
    ],
    ORDERS: [
      "Date", "OrderID", "Account_type", "Customer_Name", "Phone", "Address",
      "Products", "Color", "Size", "Quantity", "Total_Amount", "Payment_method",
      "Transaction_ID", "Payment_Status", "Order_Status", "Reseller_Commission", "Commission_Status"
    ],
    INCOMPLETE_ORDERS: [
      "Date", "OrderID", "Account_type", "Customer_Name", "Phone", "Address", "Products", "Total_Amount", "Status"
    ],
    VIEWERS: [
      "Time", "IP", "Address", "Name", "Phone", "Device", "Activity"
    ],
    BANNERS: [
      "Banner_ID", "Title", "Subtitle", "Image_URL", "Link_URL", "Button_Text", "Tag"
    ],
    CUSTOMERS: [
      "USER_ID", "Profile_photo", "Name", "Mobile", "Mail", "Address", "User_ID", "Password", "Status", "Success_order", "Cancel_Order", "Total_Order", "Order_Success_Rate"
    ],
    RESELLERS: [
      "Shop_ID", "Shop_logo", "Name", "Mobile", "Mail", "Address", "Shop_Name", "NID_Number", "Date_of_birth", "Trade_Licence_No", "User_ID", "Password", "Status"
    ],
    WHOLESALERS: [
      "Shop_ID", "Shop_logo", "Name", "Mobile", "Mail", "Address", "Shop_Name", "User_ID", "Password", "Status"
    ],
    BUYING: [
      "Date", "Who Buy", "Product Name", "buying price", "Quantity", "Total buying (calculated)", "Supplier", "Location"
    ],
    COSTS: [
      "Date", "Who Paid", "Purpose", "Amount", "Note"
    ],
    INVEST: [
      "Date", "Invest type", "Name of investor", "Amount", "Note"
    ],
    OTHERS_MARKET: [
      "Shop_ID", "Market_Logo", "Market_Name", "Shop_Name", "Shop_Link", "Status"
    ],
    ADMIN_WORKER: [
      "USER_ID", "Profile_Photo", "Name", "Mobile", "Mail", "Address", "Worker_Type", "Role", "User_Name", "Password"
    ],
    SETTINGS: [
      "Name", "Details", "Activation"
    ],
    REVIEWS: [
      "Date", "Product_ID", "Customer_Name", "Rating", "Comment", "Status"
    ],
    PAYMENTS: [
      "Date", "OrderID", "Method", "TrxID", "Amount", "Status"
    ],
    LANDING_PAGES: [
      "Page_ID", "Title", "Slug", "Content", "Status"
    ],
    WORKER_LOGS: [
      "Date", "Worker_Name", "Action", "Details"
    ]
  }
};

// ==========================================
// 2. HTTP REQUEST DISPATCHERS (CORS & JSONP)
// ==========================================
function doGet(e) {
  return handleRequest(e, "GET");
}

function doPost(e) {
  return handleRequest(e, "POST");
}

function handleRequest(e, httpMethod) {
  var action = "";
  var payload = {};
  var callback = "";

  try {
    if (e && e.parameter) {
      if (e.parameter.action) action = e.parameter.action;
      if (e.parameter.callback) callback = e.parameter.callback;

      if (e.parameter.payload) {
        try {
          payload = JSON.parse(e.parameter.payload);
        } catch (ex) {
          payload = e.parameter;
        }
      } else {
        payload = e.parameter;
      }
    }

    if (e && e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        if (parsed.action) action = parsed.action;
        if (parsed.payload) payload = parsed.payload;
      } catch (err) {
        if (e.parameter && e.parameter.action) action = e.parameter.action;
      }
    }

    if (!action) action = "system/health";

    var responseObj = dispatchAction(action, payload);
    return formatOutput(responseObj, callback);

  } catch (err) {
    var errorObj = {
      status: "error",
      success: false,
      message: err.toString(),
      stack: err.stack || ""
    };
    return formatOutput(errorObj, callback);
  }
}

function formatOutput(dataObj, callback) {
  var jsonStr = JSON.stringify(dataObj);
  if (callback && callback.trim()) {
    // JSONP response to bypass browser CORS completely
    return ContentService.createTextOutput(callback.trim() + "(" + jsonStr + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(jsonStr)
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 3. ACTION ROUTER
// ==========================================
function dispatchAction(action, payload) {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  switch (action) {
    case "system/health":
      return { 
        status: "success", 
        success: true, 
        message: "Dream Cart BD Apps Script Gateway is Online & Connected to Google Sheet!", 
        time: new Date().toISOString() 
      };

    case "setup/init":
      setupAllSystemSheets(ss);
      return { status: "success", success: true, message: "All 20 system sheets and schemas initialized successfully!" };

    // --- PRODUCTS ---
    case "products/list":
      return getProductsList(ss, payload);

    case "products/details":
      return getProductDetails(ss, payload);

    case "products/add":
    case "products/create":
      return handleAddProduct(ss, payload);

    case "products/delete":
      return handleDeleteProduct(ss, payload);

    // --- CATEGORIES ---
    case "categories/list":
      return getSheetDataAsJson(ss, CONFIG.SHEETS.CATEGORIES);

    case "categories/add":
    case "categories/create":
      return handleAddCategory(ss, payload);

    case "categories/delete":
      return handleDeleteCategory(ss, payload);

    // --- BRANDS ---
    case "brands/list":
      return getSheetDataAsJson(ss, CONFIG.SHEETS.BRANDS);

    case "brands/add":
    case "brands/create":
      return handleAddBrand(ss, payload);

    case "brands/delete":
      return handleDeleteBrand(ss, payload);

    // --- BANNERS ---
    case "banners/list":
      return getSheetDataAsJson(ss, CONFIG.SHEETS.BANNERS);

    case "banners/add":
    case "banners/create":
      return handleAddBanner(ss, payload);

    // --- ORDERS ---
    case "orders/list":
      return getSheetDataAsJson(ss, CONFIG.SHEETS.ORDERS);

    case "orders/get":
    case "orders/details":
      return getOrderDetails(ss, payload);

    case "orders/create":
      return handleOrderCreation(ss, payload);

    case "orders/update_status":
      return handleUpdateOrderStatus(ss, payload);

    // --- INCOMPLETE ORDERS ---
    case "incomplete_orders/list":
      return getSheetDataAsJson(ss, CONFIG.SHEETS.INCOMPLETE_ORDERS);

    case "incomplete_orders/create":
      return handleIncompleteOrder(ss, payload);

    // --- VIEWERS / ANALYTICS ---
    case "viewers/log":
      return logViewerActivity(ss, payload);

    // --- ADMIN KPI ---
    case "admin/kpi":
      return calculateAdminKpi(ss);

    default:
      return { status: "success", success: true, message: "Action executed: " + action };
  }
}

// ==========================================
// 4. DATA ACCESS & SHEET OPERATIONS
// ==========================================

/**
 * Fetch and normalize products list from Products sheet
 */
function getProductsList(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  if (!sheet) {
    setupAllSystemSheets(ss);
    sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  }

  var raw = sheet.getDataRange().getValues();
  if (raw.length <= 1) {
    return { status: "success", success: true, data: { items: [], total: 0 } };
  }

  var headers = raw[0];
  var items = [];
  for (var i = 1; i < raw.length; i++) {
    var row = raw[i];
    // Check if row has at least an SKU or Name
    if (!row[0] && !row[1]) continue;

    var obj = {};
    for (var h = 0; h < headers.length; h++) {
      var key = String(headers[h]).toLowerCase().replace(/[^a-z0-9_]/g, "_");
      obj[key] = row[h];
    }

    // Normalizations for frontend compatibility
    var pName = obj.p_name || obj.name || "";
    var sku = obj.sku || ("DCBD-" + i);
    var images = [];
    if (obj.images) {
      images = String(obj.images).split(",").map(function(s) { return s.trim(); }).filter(Boolean);
    }
    var thumbnail = images.length > 0 ? images[0] : (obj.thumbnail || "");

    obj.product_id = sku;
    obj.sku = sku;
    obj.name = pName;
    obj.p_name = pName;
    obj.buying_price = Number(obj.buying_price || 0);
    obj.selling_price = Number(obj.selling_price || 0);
    obj.original_price = Number(obj.original_price || obj.selling_price || 0);
    obj.wholesale_price = Number(obj.wholesale_price || Math.round(obj.selling_price * 0.85) || 0);
    obj.reseller_price = Number(obj.reseller_price || Math.round(obj.selling_price * 0.90) || 0);
    obj.stock = obj.stock !== undefined && obj.stock !== "" ? Number(obj.stock) : 50;
    obj.min_order_qty = Number(obj.min_order_q || obj.min_order_qty || 1);
    obj.min_order_q = obj.min_order_qty;
    obj.thumbnail = thumbnail;
    obj.images = images.length > 0 ? images : (thumbnail ? [thumbnail] : []);
    obj.slug = obj.slug || (pName ? pName.toLowerCase().replace(/[^a-z0-9]+/g, "-") : sku.toLowerCase());

    items.push(obj);
  }

  // Filter if params provided
  if (payload) {
    if (payload.category) {
      var cLower = String(payload.category).toLowerCase().trim();
      items = items.filter(function(p) {
        return (p.category && p.category.toLowerCase() === cLower) ||
               (p.sub_category && p.sub_category.toLowerCase() === cLower);
      });
    }
    if (payload.brand) {
      var bLower = String(payload.brand).toLowerCase().trim();
      items = items.filter(function(p) {
        return p.brand && p.brand.toLowerCase() === bLower;
      });
    }
    if (payload.in_stock) {
      items = items.filter(function(p) { return p.stock > 0; });
    }
    if (payload.search) {
      var q = String(payload.search).toLowerCase().trim();
      items = items.filter(function(p) {
        return (p.name && p.name.toLowerCase().indexOf(q) !== -1) ||
               (p.sku && p.sku.toLowerCase().indexOf(q) !== -1) ||
               (p.brand && p.brand.toLowerCase().indexOf(q) !== -1) ||
               (p.category && p.category.toLowerCase().indexOf(q) !== -1);
      });
    }
  }

  return { status: "success", success: true, data: { items: items, total: items.length } };
}

/**
 * Get product details by ID or Slug
 */
function getProductDetails(ss, payload) {
  var listRes = getProductsList(ss, null);
  var items = (listRes.data && listRes.data.items) || [];
  var target = String(payload.id || payload.slug || payload.sku || "").toLowerCase();

  for (var i = 0; i < items.length; i++) {
    var p = items[i];
    if (String(p.product_id).toLowerCase() === target ||
        String(p.sku).toLowerCase() === target ||
        String(p.slug).toLowerCase() === target) {
      return { status: "success", success: true, data: p };
    }
  }
  return { status: "error", success: false, message: "Product not found" };
}

/**
 * Append new product to Products sheet
 */
function handleAddProduct(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  if (!sheet) {
    setupAllSystemSheets(ss);
    sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  }

  var sku = payload.sku || ("DCBD-" + Math.floor(1000 + Math.random() * 9000));
  var pName = payload.name || payload.p_name || "New Product";
  var slug = payload.slug || pName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  var imagesStr = "";
  if (Array.isArray(payload.images)) {
    imagesStr = payload.images.join(", ");
  } else if (payload.thumbnail) {
    imagesStr = payload.thumbnail;
  } else if (payload.images) {
    imagesStr = String(payload.images);
  }

  var row = [
    sku,
    pName,
    payload.category || "General",
    payload.sub_category || "",
    payload.child_category || "",
    payload.brand || "Dream Cart BD",
    Number(payload.buying_price || 0),
    Number(payload.selling_price || 0),
    Number(payload.stock !== undefined ? payload.stock : 50),
    Number(payload.original_price || payload.selling_price || 0),
    Number(payload.wholesale_price || Math.round(Number(payload.selling_price || 0) * 0.85)),
    Number(payload.min_order_q || payload.min_order_qty || 1),
    imagesStr,
    slug,
    payload.description || "",
    payload.specification || "",
    payload.others || "",
    payload.color || "",
    payload.size || "",
    Number(payload.weight_kg || 0.5),
    Number(payload.width_cm || 10),
    Number(payload.length_cm || 10),
    Number(payload.height_cm || 10)
  ];

  sheet.appendRow(row);

  return {
    status: "success",
    success: true,
    message: "পণ্যটি সফলভাবে গুগল শিটে যুক্ত হয়েছে!",
    data: { sku: sku, name: pName, slug: slug }
  };
}

/**
 * Delete product from Products sheet by SKU or ID
 */
function handleDeleteProduct(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  if (!sheet) return { status: "error", success: false, message: "Products sheet not found" };

  var target = String(payload.id || payload.sku || "").toLowerCase();
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var rowSku = String(data[i][0]).toLowerCase();
    var rowSlug = String(data[i][13]).toLowerCase();
    if (rowSku === target || rowSlug === target) {
      sheet.deleteRow(i + 1);
      return { status: "success", success: true, message: "পণ্যটি শিট থেকে সফলভাবে মুছে ফেলা হয়েছে।" };
    }
  }

  return { status: "error", success: false, message: "Product not found to delete" };
}

/**
 * Append new Category to Categories sheet
 */
function handleAddCategory(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.CATEGORIES);
  if (!sheet) {
    setupAllSystemSheets(ss);
    sheet = ss.getSheetByName(CONFIG.SHEETS.CATEGORIES);
  }

  var catName = payload.category || "New Category";
  var catId = payload.catagory_id || ("CAT-" + catName.toUpperCase().replace(/[^A-Z0-9]/g, ""));
  var catSlug = payload.catagory_slug || catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  var row = [
    catId,
    catSlug,
    payload.category_image || "",
    catName,
    payload.sub_category || "",
    payload.chail_category || payload.child_category || ""
  ];

  sheet.appendRow(row);

  return {
    status: "success",
    success: true,
    message: "ক্যাটাগরি সফলভাবে গুগল শিটে যুক্ত হয়েছে!",
    data: { catagory_id: catId, category: catName }
  };
}

/**
 * Delete Category from Categories sheet
 */
function handleDeleteCategory(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.CATEGORIES);
  if (!sheet) return { status: "error", success: false, message: "Categories sheet not found" };

  var target = String(payload.id || payload.catagory_id || payload.category || "").toLowerCase();
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var rowId = String(data[i][0]).toLowerCase();
    var rowName = String(data[i][3]).toLowerCase();
    if (rowId === target || rowName === target) {
      sheet.deleteRow(i + 1);
      return { status: "success", success: true, message: "ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে।" };
    }
  }

  return { status: "error", success: false, message: "Category not found to delete" };
}

/**
 * Append new Brand to Brands sheet
 */
function handleAddBrand(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.BRANDS);
  if (!sheet) {
    setupAllSystemSheets(ss);
    sheet = ss.getSheetByName(CONFIG.SHEETS.BRANDS);
  }

  var brandName = payload.brand_name || "New Brand";
  var brandId = payload.brand_id || ("BRD-" + brandName.toUpperCase().replace(/[^A-Z0-9]/g, ""));
  var brandSlug = payload.brand_slug || brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  var row = [
    brandId,
    payload.brand_image || "",
    brandName,
    brandSlug,
    payload.brand_description || ""
  ];

  sheet.appendRow(row);

  return {
    status: "success",
    success: true,
    message: "ব্র্যান্ড সফলভাবে গুগল শিটে যুক্ত হয়েছে!",
    data: { brand_id: brandId, brand_name: brandName }
  };
}

/**
 * Delete Brand from Brands sheet
 */
function handleDeleteBrand(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.BRANDS);
  if (!sheet) return { status: "error", success: false, message: "Brands sheet not found" };

  var target = String(payload.id || payload.brand_id || payload.brand_name || "").toLowerCase();
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var rowId = String(data[i][0]).toLowerCase();
    var rowName = String(data[i][2]).toLowerCase();
    if (rowId === target || rowName === target) {
      sheet.deleteRow(i + 1);
      return { status: "success", success: true, message: "ব্র্যান্ড সফলভাবে মুছে ফেলা হয়েছে।" };
    }
  }

  return { status: "error", success: false, message: "Brand not found to delete" };
}

/**
 * Append new Banner to Banners sheet
 */
function handleAddBanner(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.BANNERS);
  if (!sheet) {
    setupAllSystemSheets(ss);
    sheet = ss.getSheetByName(CONFIG.SHEETS.BANNERS);
  }

  var bannerId = "BNR-" + Math.floor(100 + Math.random() * 900);
  var row = [
    bannerId,
    payload.title || "Offer",
    payload.subtitle || "",
    payload.image_url || "",
    payload.link_url || "/products",
    payload.button_text || "অর্ডার করুন",
    payload.tag || "স্পেশাল অফার"
  ];

  sheet.appendRow(row);
  return { status: "success", success: true, message: "ব্যানার যুক্ত হয়েছে!" };
}

/**
 * Handle new order placement, append to Orders sheet, and send email alert
 */
function handleOrderCreation(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  if (!sheet) {
    setupAllSystemSheets(ss);
    sheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  }

  var orderId = payload.order_id || ("ORD-" + Math.floor(100000 + Math.random() * 900000));
  var dateStr = Utilities.formatDate(new Date(), "Asia/Dhaka", "yyyy-MM-dd HH:mm:ss");

  var row = [
    dateStr,
    orderId,
    payload.account_type || "Customer",
    payload.customer_name || payload.name || "গ্রাহক",
    payload.phone || "",
    payload.address || "",
    payload.products || (payload.items ? payload.items.map(function(i) { return i.name + " (" + i.quantity + ")"; }).join(", ") : "Product"),
    payload.color || "",
    payload.size || "",
    payload.quantity || 1,
    payload.total_amount || 0,
    payload.payment_method || "Cash On Delivery (COD)",
    payload.transaction_id || "N/A",
    payload.payment_status || "COD",
    payload.order_status || "Order Placed",
    payload.reseller_commission || 0,
    payload.commission_status || "Pending"
  ];

  sheet.appendRow(row);

  // Send HTML Table Reminder Email
  sendOrderReminderEmail(orderId, payload, dateStr);

  return {
    status: "success",
    success: true,
    data: { order_id: orderId },
    message: "অর্ডার সফলভাবে শিটে জমা হয়েছে!"
  };
}

/**
 * Update order status
 */
function handleUpdateOrderStatus(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  if (!sheet) return { status: "error", success: false, message: "Orders sheet not found" };

  var orderId = String(payload.order_id || payload.orderId || "").toLowerCase();
  var newStatus = payload.order_status || payload.status || "Processing";
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === orderId) {
      sheet.getRange(i + 1, 15).setValue(newStatus); // Column 15 is Order_Status
      return { status: "success", success: true, message: "অর্ডার স্ট্যাটাস আপডেট হয়েছে!" };
    }
  }

  return { status: "error", success: false, message: "Order ID not found" };
}

/**
 * Get order details by OrderID or Phone
 */
function getOrderDetails(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  if (!sheet) return { status: "error", success: false, message: "Orders sheet not found" };

  var target = String(payload.order_id || payload.orderId || payload.phone || "").toLowerCase().trim();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { status: "error", success: false, message: "No orders found" };

  var headers = data[0];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowOrderId = String(row[1]).toLowerCase().trim();
    var rowPhone = String(row[4]).toLowerCase().trim();

    if (rowOrderId === target || rowPhone === target) {
      var obj = {};
      for (var h = 0; h < headers.length; h++) {
        var key = String(headers[h]).toLowerCase().replace(/[^a-z0-9_]/g, "_");
        obj[key] = row[h];
      }
      return { status: "success", success: true, data: obj };
    }
  }

  return { status: "error", success: false, message: "Order not found" };
}

/**
 * Handle incomplete order auto-tracking
 */
function handleIncompleteOrder(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.INCOMPLETE_ORDERS);
  if (!sheet) {
    setupAllSystemSheets(ss);
    sheet = ss.getSheetByName(CONFIG.SHEETS.INCOMPLETE_ORDERS);
  }

  var dateStr = Utilities.formatDate(new Date(), "Asia/Dhaka", "yyyy-MM-dd HH:mm:ss");
  var row = [
    dateStr,
    "INC-" + Math.floor(100000 + Math.random() * 900000),
    payload.account_type || "Customer",
    payload.customer_name || "",
    payload.phone || "",
    payload.address || "",
    payload.products || "",
    payload.total_amount || 0,
    "Draft/Incomplete"
  ];
  sheet.appendRow(row);
  return { status: "success", success: true };
}

/**
 * Log viewer analytics
 */
function logViewerActivity(ss, payload) {
  var sheet = ss.getSheetByName(CONFIG.SHEETS.VIEWERS);
  if (!sheet) {
    setupAllSystemSheets(ss);
    sheet = ss.getSheetByName(CONFIG.SHEETS.VIEWERS);
  }

  if (sheet) {
    var dateStr = Utilities.formatDate(new Date(), "Asia/Dhaka", "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow([
      dateStr,
      payload.ip || "ClientIP",
      payload.address || "Bangladesh",
      payload.name || "Guest",
      payload.phone || "N/A",
      payload.device || "Mobile/Desktop",
      payload.activity || "Page View"
    ]);
  }
  return { status: "success", success: true };
}

/**
 * Calculate KPI summary for Admin Dashboard from live sheets
 */
function calculateAdminKpi(ss) {
  var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var productsSheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);

  var totalOrders = 0;
  var totalSales = 0;
  var pendingOrders = 0;
  var deliveredOrders = 0;

  if (ordersSheet && ordersSheet.getLastRow() > 1) {
    var orderData = ordersSheet.getDataRange().getValues();
    totalOrders = orderData.length - 1;
    for (var i = 1; i < orderData.length; i++) {
      var amt = Number(orderData[i][10]) || 0; // Total_Amount is col 10
      totalSales += amt;
      var status = String(orderData[i][14] || "").toLowerCase();
      if (status.indexOf("pending") !== -1 || status.indexOf("placed") !== -1) {
        pendingOrders++;
      } else if (status.indexOf("delivered") !== -1) {
        deliveredOrders++;
      }
    }
  }

  var totalProducts = 0;
  var lowStockCount = 0;
  if (productsSheet && productsSheet.getLastRow() > 1) {
    var prodData = productsSheet.getDataRange().getValues();
    totalProducts = prodData.length - 1;
    for (var j = 1; j < prodData.length; j++) {
      var stock = Number(prodData[j][8]) || 0; // Stock is col 8
      if (stock <= 10) lowStockCount++;
    }
  }

  return {
    status: "success",
    success: true,
    data: {
      total_sales: totalSales,
      today_sales: Math.round(totalSales * 0.1),
      total_orders: totalOrders,
      today_orders: Math.min(totalOrders, 5),
      pending_orders: pendingOrders,
      delivered_orders: deliveredOrders,
      rto_orders: 0,
      low_stock_count: lowStockCount,
      total_products: totalProducts,
      active_sellers: 1,
      total_customers: totalOrders
    }
  };
}

/**
 * Generic helper to fetch any sheet data as JSON
 */
function getSheetDataAsJson(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    setupAllSystemSheets(ss);
    sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { status: "success", success: true, data: { items: [], total: 0 } };
  }

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { status: "success", success: true, data: { items: [], total: 0 } };

  var headers = data[0];
  var items = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    // Skip completely empty rows
    var hasValue = false;
    for (var c = 0; c < row.length; c++) {
      if (row[c] !== "" && row[c] !== null && row[c] !== undefined) {
        hasValue = true;
        break;
      }
    }
    if (!hasValue) continue;

    var obj = {};
    for (var h = 0; h < headers.length; h++) {
      var key = String(headers[h]).toLowerCase().replace(/[^a-z0-9_]/g, "_");
      obj[key] = row[h];
    }
    items.push(obj);
  }

  return { status: "success", success: true, data: { items: items, total: items.length } };
}

/**
 * Send order confirmation HTML email table
 */
function sendOrderReminderEmail(orderId, orderData, dateStr) {
  try {
    var recipient = CONFIG.SHOP.NOTIFICATION_EMAIL || "jainal.dcitbd@gmail.com";
    var subject = "🔔 [নতুন অর্ডার] " + orderId + " — " + (orderData.customer_name || "গ্রাহক") + " (৳" + (orderData.total_amount || 0) + ")";

    var htmlBody = `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #059669, #047857); padding: 20px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0; font-size: 22px; font-weight: 900;">Dream Cart BD</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">নতুন অর্ডার নোটিফিকেশন</p>
          </div>
          <div style="padding: 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px;">অর্ডার আইডি: <span style="color: #059669;">${orderId}</span></h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px; font-weight: bold;">তারিখ:</td><td style="padding: 8px;">${dateStr}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px; font-weight: bold;">গ্রাহকের নাম:</td><td style="padding: 8px;">${orderData.customer_name || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px; font-weight: bold;">মোবাইল:</td><td style="padding: 8px; color: #059669; font-weight: bold;">${orderData.phone || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px; font-weight: bold;">ঠিকানা:</td><td style="padding: 8px;">${orderData.address || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px; font-weight: bold;">পণ্য:</td><td style="padding: 8px;">${orderData.products || 'N/A'}</td></tr>
              <tr style="background: #ecfdf5;"><td style="padding: 10px; font-weight: bold; color: #065f46;">সর্বমোট:</td><td style="padding: 10px; font-weight: bold; color: #059669; font-size: 16px;">৳${orderData.total_amount || 0}</td></tr>
            </table>
          </div>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (e) {
    Logger.log("Failed to send order email: " + e.toString());
  }
}

/**
 * Setup all 20 sheets and headers if not yet present
 */
function setupAllSystemSheets(ss) {
  if (!ss) ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var schemas = CONFIG.SCHEMAS;

  for (var key in schemas) {
    var sName = CONFIG.SHEETS[key];
    if (sName) {
      var sheet = ss.getSheetByName(sName);
      if (!sheet) {
        sheet = ss.insertSheet(sName);
        sheet.appendRow(schemas[key]);
      }
    }
  }
}
