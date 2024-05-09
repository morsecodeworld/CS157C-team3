import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns";

// Calculate the total for the order
export const calculateTotal = (items) => {
  return items
    .reduce((total, item) => total + item.quantity * item.priceAtPurchase, 0)
    .toFixed(2);
};

// Format the date
export const formatDate = (dateString) => {
  return format(new Date(dateString), "PP");
};

export const processOrdersData = (orders) => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => {
    const dayFormatted = format(day, "EEEE");
    const totalOrders = orders.filter(
      (order) => format(new Date(order.orderDate), "EEEE") === dayFormatted
    ).length;
    return { day: dayFormatted, totalOrders };
  });
};

// Function to find category name by ID
export const findCategoryNameById = (categories, categoryId) => {
  const category = categories.find((category) => category._id === categoryId);
  return category ? category.name : "Unknown Category";
};

// TODO: improve pdf with https://github.com/edisonneza/jspdf-invoice-template#usage

export const generatePDF = (orderDetails, subtotal, discount, total) => {
  const doc = new jsPDF({
    orientation: "p", // Portrait
    unit: "mm",
    format: "a4",
  });
  // Prefix with appropriate URI scheme for PNG
  const logoImgBase64 =
    "data:image/png;base64,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";

  // Assuming A4 size page (210mm x 297mm) and landscape orientation
  const pageWidth = doc.internal.pageSize.getWidth();
  // const pageHeight = doc.internal.pageSize.getHeight(); // In case you need it

  // Logo positioning

  const logoWidth = 70; // Adjust as needed
  const logoHeight = 20; // Adjust as needed
  const logoX = pageWidth - logoWidth - 10; // 10 points from the right edge
  const logoY = 10; // 10 points from the top edge

  // Add logo to the document
  // Parameters: base64 string, format, x position, y position, width, height
  doc.addImage(logoImgBase64, "PNG", logoX, logoY, logoWidth, logoHeight);

  // Move the title and subsequent content down to accommodate the logo
  // Invoice title positioning
  const titleX = 10; // 10 points from the left edge
  const titleY = 20; // Align with the bottom of the logo for visual balance

  // Add the invoice title to the PDF
  doc.setFontSize(22);
  doc.text("Invoice", titleX, titleY);

  // Customer Information
  doc.setFontSize(10);
  doc.text(`Order ID: ${orderDetails._id}`, 10, 30);
  doc.text(`Order Date: ${formatDate(orderDetails.orderDate)}`, 10, 40);
  doc.text(`Customer ID: ${orderDetails.customerId}`, 10, 50);
  doc.text(`Customer Name: ${orderDetails.customerName}`, 10, 60);
  doc.text(`Customer Address: ${orderDetails.customerAddress}`, 10, 70);
  doc.text(`Contact No: ${orderDetails.customerContact}`, 10, 80);

  // Move the starting position down to avoid overlapping with the above details
  const startY = 90;
  const startX = 0;
  // Assuming orderDetails.items is an array of items. Adjust as per your actual data structure.
  const bodyData = orderDetails.items.map((item) => [
    item.name,
    item.quantity.toString(),
    `₹${item.price}`,
    `₹${item.price * item.quantity}`,
  ]);

  autoTable(doc, {
    startX,
    startY,
    theme: "grid",
    head: [["Product Name", "Quantity", "Price at Purchase", "Total"]],
    body: bodyData,
    headStyles: { fillColor: [22, 160, 133] },
    styles: { fontSize: 8 },
  });

  // Summary Section
  const finalY = doc.previousAutoTable.finalY || 100;
  doc.setFontSize(10);
  doc.text("Summary", 10, finalY + 10);
  doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 10, finalY + 15);
  doc.text(`Discount: ₹${discount.toFixed(2)}`, 10, finalY + 20);
  doc.text(`Total: ₹${total.toFixed(2)}`, 10, finalY + 25);

  // Save the PDF
  doc.save(`invoice_${orderDetails._id}.pdf`);
};
