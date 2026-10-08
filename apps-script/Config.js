/**
 * DREAM CART BD — MASTER GOOGLE APPS SCRIPT CONFIGURATION (Config.js)
 * Connected Google Spreadsheet ID: 1BGi8IXV6S7uXDi4IaR_sCJYhtpfzyLGuldo4NnGVmR8
 * Live Web App Gateway: https://script.google.com/macros/s/AKfycbwflHuBqMKWpKPTTVNY-grU_dnNphwELXbk6Hn-wcBjxJk4xvqScmT2n8i3ZQCStMI3/exec
 * Lead Developer: Jainal Abedin (CEO, Dream Career IT BD)
 * Notification Email: jainal.dcitbd@gmail.com
 */

const CONFIG = {
  SHOP: {
    NAME: "Dream Cart BD",
    OWNERS: ["Jainal Abedin", "MD. Saiful Islam"],
    LOGO_URL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7IMYDMkNYleCqUCLvSDtcioP1MAENEONLcelVu_7byA&s=10",
    ADDRESS: "Chawdhury Plaza, ground floor, room#03, Paduar Bazar, Bishwa Road, Sadar Dakshin, Cumilla-3500.",
    PHONE_1: "01581703822",
    PHONE_2: "01818273838",
    BKASH_PERSONAL: "01879653143",
    BKASH_MERCHANT: "01581703822",
    BKASH_PAYMENT_LINK: "https://shop.bkash.com/j-a-sagor-computer01581703822/paymentlink",
    NAGAD_PERSONAL: "01879653143",
    ROCKET_PERSONAL: "01581703822",
    BANK: {
      NAME: "Islami Bank Bangladesh PLC",
      SWIFT: "IBBLBDDH",
      ACCOUNT_NAME: "Jainal Abedin",
      ACCOUNT_NUMBER: "20508070200030208",
      BRANCH: "Maheshkhali Sub branch",
      ROUTING: "125260525"
    },
    OFFICE_HOURS: "Every Day 8:00 AM to 10:00 PM",
    DELIVERY_AREA: "Whole Bangladesh",
    DELIVERY_FEES: {
      IN_CUMILLA: 70,
      IN_DHAKA: 90,
      OUT_OF_DHAKA: 120,
      OFFICE_PICKUP: 0
    },
    FREE_DELIVERY_THRESHOLD: 2000,
    ONLINE_PAYMENT_DISCOUNT_PERCENT: 5,
    NOTIFICATION_EMAIL: "jainal.dcitbd@gmail.com",
    DEVELOPER: {
      NAME: "Jainal Abedin",
      ROLE: "CEO, Dream Career IT BD",
      PORTFOLIO: "https://dcitbd.github.io/Jainal-Abedin/",
      COMPANY: "https://dcitbd.github.io/dcitbd/"
    }
  },

  APP_NAME: "Dream Cart BD",
  VERSION: "3.0.0-PROD",
  ENV: "production",
  SPREADSHEET_ID: "1BGi8IXV6S7uXDi4IaR_sCJYhtpfzyLGuldo4NnGVmR8",

  // Exact 20 Sheet Names as Specified by User
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

  // Exact Column Schemas per Sheet
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
    ]
  },

  ORDER_STATUSES: [
    "Pending", "Order Placed", "Order Confirmed", "Processing", "Ready to Pack",
    "Packing", "Packed", "Ready to Ship", "Shipped", "In Transit", "Arrived at Hub",
    "Out for Delivery", "Delivered", "Delivery Failed", "Customer Unreachable",
    "Customer Requested Delay", "Rescheduled", "Return Requested", "Return Approved",
    "Return Processing", "Returned", "Refund Requested", "Refund Processing",
    "Refunded", "Exchange Requested", "Exchange Approved", "Exchange Processing",
    "Exchanged", "Cancel Requested", "Cancelled", "Payment Pending", "Payment Confirmed",
    "Payment Failed", "Payment Refunded", "On Hold", "Fraud/Risk Review",
    "Address Verification", "Completed"
  ],

  PAYMENT_METHODS: [
    "Cash On Delivery (COD)", "Bkash Personal", "Bkash Payment",
    "Nagad Personal", "Rocket Personal", "Bank Account", "Cash Payment"
  ]
};

if (typeof module !== 'undefined') {
  module.exports = CONFIG;
}
