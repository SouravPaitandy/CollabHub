/**
 * Print and PDF export utilities for CollabHub documents
 * Provides functions to print documents with headers/footers and export as PDF
 */

// // Import html2pdf dynamically in the browser environment only
// let html2pdf;
// if (typeof window !== 'undefined') {
//   // Only import in browser environment
//   import('html2pdf.js').then(module => {
//     html2pdf = module.default;
//   }).catch(err => {
//     console.error('Error loading html2pdf module:', err);
//   });
// }

/**
 * Print utility for CollabHub documents
 * Extracts document content and creates a print-friendly version with header and footer
 */
export const printUtils = (documentTitle, setShowDropdown, userName = null) => {
  try {
    // Get the editor content
    const editorContentContainer = document.querySelector(".editor-content-container");
    const editorContent = document.querySelector(".editor-content");

    if (!editorContent || !editorContentContainer) {
      console.error("Could not find document content elements");
      alert("Could not find document content to print.");
      return;
    }

    // Create a new window for printing with a specific name to prevent browser blocking
    const printWindowFeatures = "width=1000,height=800,menubar=yes,toolbar=yes,scrollbars=yes";
    const printWindow = window.open("", "print_window", printWindowFeatures);
    
    if (!printWindow) {
      alert("Please allow popup windows to print your document.");
      return;
    }

    // Wait a moment to ensure the window opens properly
    setTimeout(() => {
      try {
        // Get all stylesheet links from the current document for consistent styling
        const stylesheets = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]')
        ).map((link) => link.outerHTML);

        // Generate the HTML document with enhanced styling
        const html = generateDocumentHTML(documentTitle, stylesheets, editorContent, userName);

        // Write to the print window - check if the window is still open
        if (printWindow.document) {
          printWindow.document.open();
          printWindow.document.write(html);
          printWindow.document.close();

          // Add an onload handler to ensure content is fully loaded before printing
          printWindow.onload = function() {
            try {
              // Additional delay to ensure styles are applied
              setTimeout(() => {
                try {
                  printWindow.print();
                  setTimeout(() => {
                    if (!printWindow.closed) {
                      printWindow.close();
                    }
                  }, 500);
                } catch (printError) {
                  console.error("Print operation error:", printError);
                }
              }, 300);
            } catch (onloadError) {
              console.error("Window onload error:", onloadError);
            }
          };
        } else {
          throw new Error("Print window was closed or blocked");
        }

        // Close dropdown if provided
        if (setShowDropdown) {
          setShowDropdown(false);
        }
      } catch (windowError) {
        console.error("Window manipulation error:", windowError);
        alert("There was an error preparing your document for printing. Please check your popup blocker.");
      }
    }, 100);

  } catch (error) {
    console.error("Print error:", error);
    alert("There was an error preparing your document for printing. Please try again.");
  }
};

/**
 * Generate HTML for both printing and PDF export
 */
function generateDocumentHTML(documentTitle, stylesheets, editorContent, userName = null) {
  const date = new Date();
  const formattedDate = date.toLocaleDateString();
  const formattedDateTime = date.toLocaleString();
  const title = documentTitle || "Untitled Document";
  const userInfo = userName ? `Prepared by: ${userName}` : "";
  
return `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <meta charset="UTF-8">
    ${stylesheets.join("\n")}
    <style>
        /* Reset and base styles */
        body, html {
            margin: 0;
            padding: 0;
            color: #000000;
            background: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            line-height: 1.5;
        }
        
        /* Container for PDF content */
        .pdf-container {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
        }
        
        /* Modern, streamlined header */
        .doc-header {
            padding: 15px 20mm 12px;
            border-bottom: 2px solid #4F46E5;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            background: linear-gradient(to right, rgba(79, 70, 229, 0.03), rgba(79, 70, 229, 0));
        }
        
        .company-info {
            display: flex;
            align-items: center;
        }
        
        .company-logo {
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .company-logo img {
            width: 32px;
            height: 32px;
            border-radius: 6px;
        }
        
        .company-text h2 {
            margin: 0;
            font-size: 15px;
            font-weight: 600;
            color: #111827;
        }
        
        .company-text p {
            margin: 0;
            font-size: 11px;
            color: #6B7280;
            letter-spacing: 0.3px;
        }
        
        .document-info {
            text-align: right;
        }
        
        .document-info h1 {
            margin: 0 0 3px 0;
            font-size: 17px;
            color: #111827;
            font-weight: 600;
        }
        
        .document-info p {
            margin: 0;
            font-size: 11px;
            color: #6B7280;
        }
        
        /* Content styling */
        .doc-content {
            padding: 0 20mm 28mm 20mm;
            width: calc(100% - 40mm);
            min-height: 70vh;
        }
        
        /* Cleaner, less intrusive footer */
        .doc-footer {
            padding: 8px 20mm;
            border-top: 1px solid #E5E7EB;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9px;
            color: #9CA3AF;
            position: fixed;
            bottom: 0;
            width: calc(100% - 40mm);
            background-color: white;
        }
        
        .doc-footer-left {
            display: flex;
            align-items: center;
        }
        
        .footer-logo {
            font-weight: 600;
            color: #4F46E5;
            margin-right: 3px;
        }
        
        .page-number {
            font-weight: 500;
        }
        
        /* Print-specific styles */
        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            .doc-header {
                background: linear-gradient(to right, rgba(79, 70, 229, 0.05), rgba(79, 70, 229, 0)) !important;
            }
            
            .doc-footer {
                position: fixed;
                bottom: 0;
            }
            
            /* Page break controls */
            .page-break {
                page-break-after: always;
                break-after: page;
                height: 0;
                display: block;
            }
            
            /* Avoid breaking these elements across pages */
            pre, table, figure, img {
                page-break-inside: avoid;
            }
            
            h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
                page-break-inside: avoid;
            }
            
            /* Remove cursor indicators and interactive elements */
            .collaboration-cursor, 
            .collaboration-cursor-label,
            .image-controls,
            .ProseMirror-gapcursor {
                display: none !important;
            }
            
            /* Set page margins */
            @page {
                margin-bottom: 25mm;
            }
        }
        
        /* Rest of your styles remain the same... */
    </style>
</head>
<body>
    <div class="pdf-container">
        <div class="doc-header">
            <div class="company-info">
                <div class="company-logo">
                    
                    <img src="/favicon.png">
                </div>
                <div class="company-text">
                    <h2>CollabHub</h2>
                    <p>Sync · Create · Succeed</p>
                </div>
            </div>
            <div class="document-info">
                <h1>${title}</h1>
                <p>${formattedDate}${userInfo ? ` · ${userInfo}` : ''}</p>
            </div>
        </div>
        
        <div class="doc-content">
            <div class="${editorContent.className}">
                ${editorContent.innerHTML}
            </div>
        </div>
        
        <div class="doc-footer">
            <div class="doc-footer-left">
                <span class="footer-logo">CollabHub</span> · ${title}
            </div>
            <div class="page-number">Page 1</div>
        </div>
    </div>
    
    <script>
        // Document enhancement script
        window.onload = function() {
            // Fix for code blocks not showing background in print/PDF
            document.querySelectorAll('pre, code').forEach(element => {
                element.style.backgroundColor = '#f5f5f5';
                element.style.color = '#333';
            });
            
            // Add page numbers - simplified for this implementation
            const pageNumbers = document.querySelectorAll('.page-number');
            pageNumbers.forEach(el => {
                el.textContent = 'Page 1';
            });
            
            // Auto-print for the print window
            setTimeout(function() {
                if (window.opener) { // Only auto-print if in a popup window
                    window.print();
                    setTimeout(() => window.close(), 500);
                }
            }, 500);
        };
    </script>
</body>
</html>
`;
}