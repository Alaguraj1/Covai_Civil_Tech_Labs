import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';

const Print = () => {
    const router = useRouter();
    const { id } = router.query;

    const [invoiceReport, setInvoiceReport] = useState<any>([])
const [finalHtml, setFinalHtml] = useState<any>()

    const getTestReport = () => {
        if (id) {
            const Token = localStorage.getItem("token")

            axios.get(`https://files.covaiciviltechlab.com/preview_invoice_test_template/${id}/`, {
               
            }).then((res) => {
                setInvoiceReport(res.data);
            }).catch((error) => {
                console.log(error);
            });
        }
    };

  

    useEffect(() => {
        getTestReport();
    }, [id]);

    useEffect(() => {


        const table = invoiceReport?.invoice_test?.final_html;
    
        // Check if table is defined before further processing
        if (table) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = table;
    
            // Find all table elements
            let tableElements = tempDiv.querySelectorAll('table, tr, td, th');
    
            let TableElement2 = tempDiv.querySelectorAll('table')
            // Get the last table element
            let lastTable = TableElement2[TableElement2.length - 1];
    
            // Loop through all table elements and update the styles
            tableElements.forEach((tableElement:any) => {
                // Check if the current table is not the last one
                if (tableElement !== lastTable) {
                    tableElement.style.border = "1px solid black";
                } else {
                    // If it's the last table, set border to red
                    tableElement.style.border = "1px solid red";
                }
            });

            if (lastTable) {
      
                lastTable.style.border = 'none';
          
                // Remove border style for all rows in the last table
                lastTable.querySelectorAll('tr').forEach(row => {
                  row.style.border = 'none';
                });
          
                // Remove border style for all cells in the last table
                lastTable.querySelectorAll('td').forEach(cell => {
                  cell.style.border = 'none';
                });

            }
    
            let figureElements = tempDiv.querySelectorAll('figure');
            figureElements.forEach((figureElement:any) => {
                figureElement.style.width = "100%"; // Set the width to 100%
                figureElement.style.marginBottom = "20px";
            });

            let headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4');
            headingElements.forEach((headingElement:any) => {
                headingElement.style.textAlign = "center"; // Set the width to 100%
                // headingElement.style.marginBottom = "20px";
            });
    
            // Now, you can use tempDiv.innerHTML to get the updated HTML content
            const updatedHTML = tempDiv.innerHTML;
            
            setFinalHtml(updatedHTML);
        }
    }, [invoiceReport?.invoice_test?.report_template]);
    
    


return (
    <>
        <div style={{ padding: "10px 10px" }}>
            <div className='hide-media' dangerouslySetInnerHTML={{ __html: finalHtml }}></div>
        </div>
    </>
)
}

export default Print