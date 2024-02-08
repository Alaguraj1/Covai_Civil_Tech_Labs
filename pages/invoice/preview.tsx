import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Preview = () => {
    const [wordAmt, setWordAmt] = useState('');
    const router = useRouter();
    const { id } = router.query;
    const [printData, setPrintData] = useState<any>([]);

    useEffect(() => {
        calcAmt();
    }, []);

    const toWords = (amount: any) => {
        return `Words for ${amount}`;
    };

    const calcAmt = () => {
        const amt = '11,446.00';
        const upperto = toWords(amt);
        const word = upperto.slice(0, 1).toUpperCase() + upperto.slice(1);
        setWordAmt(word);
    };

    useEffect(() => {
        axios
            .get(`https://files.covaiciviltechlab.com/print_invoice/${id}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            })
            .then((res) => {
                setPrintData(res?.data);
            })
            .catch((error: any) => {
                if (error.response.status === 401) {
                    router.push('/');
                }
            });
    }, [id]);

    const TestTotal: any = printData?.invoice_tests?.reduce((accumulator: any, currentValue: any) => accumulator + parseFloat(currentValue.total || 0), 0);

    const Add_Discount = (TestTotal * printData?.invoice?.discount) / 100;

    const BeforeTotal = TestTotal - Add_Discount;

    // Taxs
    const taxIds = printData?.invoice?.tax;

    const filteredTaxes = printData?.taxes?.filter((tax: any) => taxIds.includes(tax.id));

    const Discount: any = () => {
        if (filteredTaxes?.length > 0) {
            const percentagesArray = filteredTaxes.map((item: any) => `${parseFloat(item.tax_percentage)}%`);

            const sum = percentagesArray.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0);

            const selectedName = filteredTaxes.map((item: any) => item.tax_name);
            const nameString = selectedName.join(' + ');

            const percentagesString = percentagesArray.join(' + ');
            return `${nameString} : ${percentagesString}`;
        }
        return '';
    };

    // tax total amount
    if (filteredTaxes?.length > 0) {
        const percentagesArray = filteredTaxes.map((item: any) => parseFloat(item.tax_percentage));

        var sum = percentagesArray.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0);
    }
    const Tax_total = (BeforeTotal * sum) / 100;

    // after tax
    const After_Tax: any = BeforeTotal + Tax_total;

console.log("printData", printData?.invoice)

    return (
        <>
            <div>
                <style
                    type="text/css"
                    dangerouslySetInnerHTML={{
                        __html: '\n.style3 {\n\tfont-size: 22px;\n\tfont-weight: bold;\n}\n\ntable td, th {\n\tfont-size: 13px;\n}\n',
                    }}
                />
                <div className="container" style={{ padding: '10px 0px' }}>
                    <div className="panel">
                        <div className="flex grid-cols-3 flex-wrap justify-between gap-4 px-4">
                            <div>
                                <div className="text-3xl font-semibold uppercase">Invoice</div>
                                <p>Invoice No : {printData?.invoice?.invoice_no}</p>
                            </div>

                            <div className="grid-cols-9 pl-7 ltr:text-right rtl:text-left">
                                <div className="shrink-0" style={{ display: 'flex', justifyContent: 'end' }}>
                                    <img src="/assets/images/logo-in.png" alt="img" style={{ width: '75%' }} className="w-17 ltr:ml-auto rtl:mr-auto" />
                                </div>
                                <div className="mt-0 space-y-1 text-right text-white-dark">
                                    <div style={{ fontSize: '14px' }}>
                                        <b>AN ISO 9001:2008 CERTIFIED LAB</b>
                                        <br></br>
                                        411/4, Ballu Naidu Thottam,Vijayalakshmi Nagar,<br></br>
                                        Neelikonampalayam Po, Coimbatore - 6410333.<br></br>
                                        <b>GSTIN : 33AAICN1420AIZA</b>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-2 border-white-light dark:border-[#1b2e4b]" />
                        <div className="preview-header " style={{ fontSize: '12px' }}>
                            <div className="flex-1">
                                <div className="space-y-1 text-white-dark">
                                    <div>Issue For:</div>
                                    <div className="font-semibold text-black dark:text-white">
                                        {printData?.customer?.customer_name} <br />
                                        {printData?.customer?.address1}
                                        <br></br>
                                        <div className="space-y-1 text-white-dark">
                                            -Original for Receipient<br></br>
                                            -Duplicate for Supplier Transporter<br></br>
                                            -Triplicate for Supplier
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between gap-6 sm:flex-row lg:w-2/3">
                                <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                                    <div className="mb-1 flex w-full items-center justify-between">
                                        <div className="text-white-dark">Issue Date :</div>
                                        <div>{printData?.invoice?.date}</div>
                                    </div>

                                    <div className="mb-1 flex w-full items-center justify-between">
                                        <div className="text-white-dark">Project Name :</div>
                                        <div>{printData?.invoice?.project_name}</div>
                                    </div>
                                    <div className="mb-1 flex w-full items-center justify-between">
                                        <div className="text-white-dark">Place of Testing :</div>
                                        <div>{printData?.invoice?.place_of_testing}</div>
                                    </div>
                                    <div className="mb-1 flex w-full items-center justify-between">
                                        <div className="text-white-dark"> GSTIN/UIN :</div>
                                        <div>{printData?.customer?.gstin_no}</div>
                                    </div>
                                </div>

                                <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                                    <div className="mb-1 flex w-full items-center justify-between">
                                        <div className="text-white-dark">Name:</div>
                                        <div className="whitespace-nowrap">Covai Civil Tech Lab</div>
                                    </div>
                                    <div className="mb-1 flex w-full items-center justify-between">
                                        <div className="text-white-dark">Account Number:</div>
                                        <div>584705000004</div>
                                    </div>
                                    <div className="mb-1 flex w-full items-center justify-between">
                                        <div className="text-white-dark">Branch:</div>
                                        <div>Saibaba colony branch, coimbatore.</div>
                                    </div>
                                    <div className="mb-1 flex w-full items-center justify-between">
                                        <div className="text-white-dark">IFSC Code:</div>
                                        <div>ICIC0001550</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive invoice-table mt-3">
                            <table className="table-striped">
                                <thead style={{ border: '1px solid black' }}>
                                    <tr>
                                        <th style={{ border: '1px solid black' }}>S.No</th>
                                        <th style={{ border: '1px solid black' }}>Name of Test</th>
                                        <th style={{ border: '1px solid black' }}>HAN/SAC</th>
                                        <th style={{ border: '1px solid black' }}>Qty</th>
                                        <th style={{ textAlign: 'right', border: '1px solid black' }}>Rate/Sample(INR)</th>
                                        <th style={{ textAlign: 'right', border: '1px solid black' }}>Amount(INR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {printData?.invoice_tests?.map((invoice: any, index: any) => {
                                        return (
                                            <>
                                                <tr style={{ border: '1px solid black' }}>
                                                    <td style={{ border: '1px solid black' }}>{index + 1}</td>
                                                    <td style={{ border: '1px solid black' }}>
                                                        {invoice?.test_name} - <span style={{ fontWeight: 'bold' }}>{invoice?.material_name}</span>
                                                    </td>
                                                    <td style={{ border: '1px solid black' }}>998346</td>
                                                    <td style={{ border: '1px solid black' }}>{invoice?.qty}</td>
                                                    <td style={{ textAlign: 'right', border: '1px solid black' }}>{invoice?.price_per_sample}</td>
                                                    <td style={{ textAlign: 'right', border: '1px solid black' }}>{parseInt(invoice?.total, 10)}</td>
                                                </tr>
                                            </>
                                        );
                                    })}

                                    {printData?.invoice?.discount >= 1 ? (
                                        <tr style={{ border: 'none' }}>
                                            <>
                                                <td> </td>
                                                <td> </td>
                                                <td> </td>
                                                <td> </td>
                                                <td style={{ textAlign: 'right' }}>Discount</td>
                                                <td style={{ textAlign: 'right' }}>{printData?.invoice?.discount}</td>
                                            </>
                                        </tr>
                                    ) : null}

                                    <tr style={{ border: 'none' }}>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td style={{ textAlign: 'right' }}>Before Tax</td>
                                        <td style={{ textAlign: 'right' }}>{BeforeTotal.toFixed(2)}</td>
                                    </tr>

                                    <tr style={{ border: 'none' }}>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td style={{ textAlign: 'right' }}>{Discount()}</td>
                                        <td style={{ textAlign: 'right' }}>{Tax_total.toFixed(2)}</td>
                                    </tr>

                                    <tr style={{ border: 'none' }}></tr>
                                    <tr style={{ border: 'none' }}>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td></td>
                                        <td style={{ textAlign: 'right' }}>Total</td>
                                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                            {parseInt(After_Tax, 10)} <input type="hidden" id="amt" name="amt" defaultValue="11,446.00" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/*footer */}
                        <hr className="my-2 border-white-light dark:border-[#1b2e4b]" />
                        <div className="preview-footer-main">
                            <div className="preview-qr-outer">
                                <img src="/assets/images/Sponsor.jpg" style={{ textAlign: 'center', width: '75%', height: '50%' }} alt="image" />
                            </div>

                            {printData?.invoice?.invoice_no === null ? (
                                <></>
                            ) : (
                                <>
                                    <div className="preview-qr-outer">
                                        <img src={printData?.invoice?.qr} style={{ textAlign: 'center', width: '120px', height: '120px' }} alt="image" />
                                    </div>
                                </>
                            )}


                            <div className="preview-qr-outer">
                                <div className="mt-0 grid-cols-9 space-y-1 text-right text-right text-sm text-white-dark">
                                    <img src="/assets/images/sign.png" alt="img" style={{ marginLeft: 'auto' }} />
                                    <br />
                                    COVAI CIVIL TECH LAB <br /> R.TIRUMALAI (TECHNICAL DIRECTOR)
                                    {/* <img src="/assets/images/logo_3.jpg" alt="img" style={{ marginLeft: "auto" }} /> */}
                                    <div className="mt-0 space-y-1 text-right text-sm text-white-dark">
                                        <b>Phone</b> : <a href="tel:9840014193"> 9840014193 </a>|<br />
                                        <i>
                                            <b>Email :</b>{' '}
                                            <a href="mailto:cbe@covaiciviltechlab.com" target="_blank">
                                                cbe@covaiciviltechlab.com{' '}
                                            </a>
                                        </i>{' '}
                                        
                                        <i>
                                            <b>Website :</b>{' '}
                                            <a href="https://covaiciviltechlab.com/" target="blank">
                                                covaiciviltechlab.com
                                            </a>
                                        </i>
                                        <br></br>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container" style={{ fontSize: '14px' }}>
                    {' '}
                    <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                        <b>Declaration:-</b> We declare that this invoice shows the actual price of the Test Services described and that all particulars are true and correct. <br /> <br />
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '12px' }}>
                        SUBJECT TO COIMBATORE JURISDICTION
                        <br /> This is computer Generated Invoice.
                    </div>
                </div>
            </div>
        </>
    );
};

export default Preview;
