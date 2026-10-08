# 🛍️ Dream Cart BD — Smart Digital Commerce & Multi-Vendor Platform

[![Platform](https://img.shields.io/badge/Platform-Dream%20Cart%20BD-059669.svg)](https://dcitbd.github.io/dcitbd/)
[![Version](https://img.shields.io/badge/Version-3.0.0--PROD-blue.svg)]()
[![Hosting](https://img.shields.io/badge/Hosting-GitHub%20%7C%20Cloudflare%20%7C%20cPanel-emerald.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Google%20Sheets%20%2B%20Apps%20Script-amber.svg)]()

> **Smart Digital Commerce for Modern Living.**  
> সম্পূর্ণ রেসপন্সিভ, হাই-স্পিড ও প্রফেশনাল মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম। কোনো হ্যাশ (`#`) ছাড়া ক্লিন ইউআরএল (`domain/products`), সকল স্ক্রিন সাইজ (মোবাইল, ট্যাবলেট, ল্যাপটপ, ডেক্সটপ ও টিভি) উপযোগী এবং গুগল শিট ব্যাকএন্ড সহ প্রস্তুত।

---

## 📌 প্ল্যাটফর্ম ও ডেভেলপমেন্ট তথ্য (Developer & Shop Profile)

- **শপের নাম:** Dream Cart BD
- **হেড অফিস ও শোরুম:** চৌধুরী প্লাজা, নিচতলা, রুম #০৩, পদুয়ার বাজার বিশ্বরোড, সদর দক্ষিণ, কুমিল্লা-৩৫০০।
- **হটলাইন ১ (WhatsApp):** `01581703822` (https://wa.me/8801581703822)
- **হটলাইন ২ (Call):** `01818273838` (tel:01818273838)
- **অফিসিয়াল ইমেইল:** `jainal.dcitbd@gmail.com`
- **অফিস সময়:** প্রতিদিন সকাল ৮:০০ টা থেকে রাত ১০:০০ টা
- **ডেভেলপার:** **জৈনাল আবেদীন (Jainal Abedin)**  
  - CEO, **Dream Career IT BD**  
  - পোর্টফোলিও: [https://dcitbd.github.io/Jainal-Abedin/](https://dcitbd.github.io/Jainal-Abedin/)  
  - কোম্পানি ওয়েবসাইট: [https://dcitbd.github.io/dcitbd/](https://dcitbd.github.io/dcitbd/)

---

## 🔗 কানেক্টেড ব্যাকএন্ড (Connected Backend & API)

- **Google Spreadsheet:** [Dream Cart BD Live Sheet](https://docs.google.com/spreadsheets/d/1BGi8IXV6S7uXDi4IaR_sCJYhtpfzyLGuldo4NnGVmR8/edit?gid=2106627979#gid=2106627979)
- **Spreadsheet ID:** `1BGi8IXV6S7uXDi4IaR_sCJYhtpfzyLGuldo4NnGVmR8`
- **Apps Script Live Gateway:** `https://script.google.com/macros/s/AKfycbwflHuBqMKWpKPTTVNY-grU_dnNphwELXbk6Hn-wcBjxJk4xvqScmT2n8i3ZQCStMI3/exec`
- **অফিশিয়াল শপ লোগো:** `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7IMYDMkNYleCqUCLvSDtcioP1MAENEONLcelVu_7byA&s=10`

---

## 🚀 ক্লিন ইউআরএল রাউটিং ও হোস্টিং গাইড (Clean URL Hosting Compatibility)

আপনার স্পেসিফিকেশন অনুযায়ী সাইটটিতে কোনো হ্যাশ (`#`) বা অপশন ব্যবহার করা হয়নি। ব্রাউজারের অ্যাড্রেস বারে সরাসরি ক্লিন ইউআরএল প্রদর্শিত হবে:
`domain/products`, `domain/cart`, `domain/checkout`, `domain/admin`, ইত্যাদি।

### ১. GitHub Pages হোস্টিং:
- সাইটের রুটে একটি স্মার্ট `404.html` দেওয়া আছে যা স্বয়ংক্রিয়ভাবে ক্লিন পাথ হ্যান্ডেল করে।
- এছাড়াও GitHub Pages ও সাধারণ স্ট্যাটিক সার্ভারের সুবিধার্থে প্রতি রুটের জন্য ডিরেক্টরি এন্ডপয়েন্ট (`products/index.html`, `cart/index.html`, `admin/index.html` ইত্যাদি) জেনারেট করা হয়েছে। ফলে সাবফোল্ডার বা কাস্টম ডোমেইন উভয়েই সরাসরি রিলোড দিলেও পেজ লোড হবে কোনো ত্রুটি ছাড়া।
- প্রজেক্ট সাবপাথ (যেমন: `https://username.github.io/repository/`) স্বয়ংক্রিয়ভাবে ডিটেক্টেড হয়।

### ২. Cloudflare Pages হোস্টিং:
- রুটে `_redirects` ফাইল সংযুক্ত আছে (`/* /index.html 200`), যা যেকোনো পাথের জন্য সরাসরি `index.html` সার্ভ করে ক্লিন ইউআরএল নিশ্চিত করে।
- `_routes.json` কনফিগারেশন সংযুক্ত।

### ৩. cPanel (Apache) হোস্টিং:
- রুটে স্ট্যান্ডার্ড `.htaccess` ফাইল দেওয়া আছে, যাতে Apache `mod_rewrite` মডিউল ব্যবহার করে সমস্ত রিকোয়েস্ট ইন্টারনালি `index.html`-এ রিরাইট করা হয়।

---

## 🌟 প্রধান প্রধান ফিচারসমূহ (Key Features & Highlights)

1. **ফুল রেসপন্সিভ ডিজাইন (Mobile to 4K TV):**
   - মোবাইল (৩২০-৪৮০ পিক্সেল), ফ্যাবলেটে ২-কলাম গ্রিড, ট্যাবলেটে ৩-কলাম গ্রিড, ল্যাপটপে ৪-কলাম গ্রিড এবং আল্ট্রা-ওয়াইড মনিটর ও টিভিতে হাই-রেজোলিউশন রেসপন্সিভ গ্রিড।
   - ডার্ক মোড (Dark Mode) ও লাইট মোড টগল উইথ পারসিস্টেন্স।
2. **লাইভ সার্চ ও প্রেডিক্টিভ প্রিভিউ (Predictive Search):**
   - হেডার ও মোবাইল সার্চবারে টাইপ করলেই প্রোডাক্টের ছবি, টাইটেল, মূল্য ও স্টক সহ ড্রপডাউন প্রিভিউ কার্ড ভেসে উঠবে এবং ক্লিক করলেই সরাসরি ডিটেইলস দেখা যাবে।
3. **প্রোডাক্ট কার্ড অ্যানিমেশন ও ফিচারসমূহ:**
   - কার্ডের ছবির ওপরে লাভ/ফেভারিট আইকন এবং ডিসকাউন্ট পার্সেন্টেজ ব্যাজ।
   - ব্র্যান্ড নাম + SKU কোড।
   - প্রোডাক্ট নাম (২ লাইনে ক্ল্যাম্পড উইথ ইলিপসিস)।
   - রোল-ভিত্তিক ডায়নামিক প্রাইসিং:
     - সাধারণ গ্রাহক: সেলিং প্রাইস + ক্রস করা অরিজিনাল প্রাইস + স্টক পিস।
     - রিসেলার: রিসেলার পাইকারি দর + মার্জিন।
     - হোলসেলার: হোলসেল রেট + সর্বনিম্ন অর্ডার পরিমাণ (MOQ) নোটিশ।
   - স্টক শেষ থাকলে **Pre Order** বাটন এবং স্টক থাকলে **Order Now** বাটন।
   - কুইক কার্ট আইকন + ফেভারিট আইকন + ২টি ডেডিকেটেড হোয়াটসঅ্যাপ বাটন (01581703822 ও 01818273838)।
4. **ফিক্সড ফ্লোটিং অ্যাকশন ডক (Floating Actions):**
   - ভাসমান কার্ট বাটন (লাইভ ব্যাজ কাউন্টার)।
   - ভাসমান সরাসরি কল বাটন (সাব-বাটন ১: 01581703822, সাব-বাটন ২: 01818273838)।
   - ভাসমান WhatsApp বাটন (সাব-বাটন ১: 01581703822, সাব-বাটন ২: 01818273838)।
   - ভাসমান লাইভ চ্যাট বাটন।
5. **অফিশিয়াল ডিজিটাল ভাউচার ও ইনভয়েস (Printable/Downloadable Voucher):**
   - গ্রাহকের তথ্য, শপের তথ্য, লোগো, লোগো ওয়াটারমার্ক, বারকোড (Barcode), অর্ডারের বিবরণ, পেমেন্ট ইনফো, স্লোগান ও থ্যাঙ্কস মেসেজ।
   - এক ক্লিকে প্রিন্ট ও PDF ডাউনলোড সুবিধা।
6. **স্বয়ংক্রিয় রিমাইন্ডার ইমেইল সিস্টেম (jainal.dcitbd@gmail.com):**
   - নতুন অর্ডার আসলে ডিজিটাল টেবিল ফরম্যাটে সম্পূর্ণ তথ্য সহ ইমেইল নোটিফিকেশন প্রেরিত হয়।
7. **ক্যাম্পেইন ল্যান্ডিং পেজ (`/landing`):**
   - চমৎকার বাংলা স্লোগান, লাইভ কাউন্টডাউন টাইমার, মূল ওয়েবসাইটের লিঙ্ক, ৫-১০টি আকর্ষণীয় প্রোডাক্ট কার্ড, কাস্টমার রিভিউ স্ক্রিনশট ও ছবি, ফাস্ট অর্ডার ফর্ম ও কনফার্মেশন পপআপ।
8. **মাল্টি-রোল পোর্টাল সিস্টেম:**
   - **Customer Portal:** লগইন, নিবন্ধন, প্রোফাইল এডিট, অর্ডারের তালিকা ও ভাউচার ডাউনলোড, কার্ট ও উইশলিস্ট।
   - **Reseller Portal:** লগইন, নিবন্ধন, ড্যাশবোর্ড, পেমেন্ট উইথড্রয়াল রিকোয়েস্ট (-৩% প্রসেসিং অপশন), পেমেন্ট মেথড যুক্তকরণ (বিকাশ, নগদ, রকেট, ব্যাংক, উপায়, QR), ক্যাটালগ ও অর্ডার।
   - **Wholesaler Portal:** লগইন, নিবন্ধন, ড্যাশবোর্ড, হোলসেল ক্যাটালগ, MOQ ভ্যালিডেশন, বাল্ক ইনভয়েস।
   - **Admin / Worker Portal:** কর্মী পদবী ও ইউজারনেম নির্বাচন, ডায়নামিক ক্যাপচা সিকিউরিটি, কেপিআই ড্যাশবোর্ড, প্রোডাক্ট ম্যানেজমেন্ট, ক্যাটাগরি ট্রি, অর্ডার ম্যানেজমেন্ট (৩৭টি স্ট্যাটাস), অসম্পূর্ণ অর্ডার ফলো-আপ, ব্যানার, রিপোর্ট সেন্টার এবং সাইট সেটিংস।

---

## 📂 ২০টি গুগল শিটের স্কিমা ম্যাপিং (20 Sheets & Columns)

1. **Products:** SKU, P_Name, Category, Sub_Category, Child_Category, Brand, Buying_price, Selling_Price, Stock, Original_Price, WholeSale_price, Min_order_Q, Images, Slug, Description, Specification, Others, Color, Size, WEIGHT_KG, WIDTH_CM, LENGTH_CM, HEIGHT_CM
2. **Categories:** Catagory_ID, Catagory_Slug, Category_Image, Category, Sub_Category, Chail_Category
3. **Brands:** Brand_ID, Brand_Image, Brand_Name, Brand_Slug, Brand_Description
4. **Orders:** Date, OrderID, Account_type, Customer_Name, Phone, Address, Products, Color, Size, Quantity, Total_Amount, Payment_method, Transaction_ID, Payment_Status, Order_Status, Reseller_Commission, Commission_Status
5. **Incomplete_Orders:** Date, OrderID, Account_type, Customer_Name, Phone, Address, Products, Total_Amount, Status
6. **Viewers:** Time, IP, Address, Name, Phone, Device, Activity
7. **Customers:** USER_ID, Profile_photo, Name, Mobile, Mail, Address, User_ID, Password, Status, Success_order, Cancel_Order, Total_Order, Order_Success_Rate
8. **Resellers:** Shop_ID, Shop_logo, Name, Mobile, Mail, Address, Shop_Name, NID_Number, Date_of_birth, Trade_Licence_No, User_ID, Password, Status
9. **Wholesalers:** Shop_ID, Shop_logo, Name, Mobile, Mail, Address, Shop_Name, User_ID, Password, Status
10. **Buying:** Date, Who Buy, Product Name, buying price, Quantity, Total buying (calculated), Supplier, Location
11. **Costs:** Date, Who Paid, Purpose, Amount, Note
12. **Invest:** Date, Invest type, Name of investor, Amount, Note
13. **Others_Market:** Shop_ID, Market_Logo, Market_Name, Shop_Name, Shop_Link, Status
14. **Admin/Worker:** USER_ID, Profile_Photo, Name, Mobile, Mail, Address, Worker_Type, Role, User_Name, Password
15. **Settings:** Name, Details, Activation
16. **Banners**
17. **Reviews**
18. **Payments**
19. **Landing-Pages**
20. **Worker-Logs**

---

## 🛠️ প্রোজেক্ট রান করার নির্দেশিকা (Local Run & Deployment)

### লোকাল প্রিভিউ:
সরাসরি যেকোনো লোকাল সার্ভার দিয়ে ওপেন করুন:
```bash
# Python
python3 -m http.server 3000

# অথবা Node npx
npx serve .
```
ব্রাউজারে ভিজিট করুন: `http://localhost:3000/`

---
&copy; 2026 **Dream Cart BD**. সর্বস্বত্ব সংরক্ষিত।  
কারিগরি সহায়তায়: **জৈনাল আবেদীন (CEO, Dream Career IT BD)**.
