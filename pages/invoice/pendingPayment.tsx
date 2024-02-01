import React, { useState, useEffect } from 'react';
import { Space, Table } from 'antd';
import { Button } from 'antd';
import {  Input } from 'antd';
import axios from 'axios';
import * as FileSaver from 'file-saver';
import ExcelJS from 'exceljs';
import router from 'next/router';

const PendingPayment = () => {
    const { Search } = Input;
    const [dataSource, setDataSource] = useState([]);
    const [filterData, setFilterData] = useState(dataSource);

    // get Tax datas
    useEffect(() => {
        GetTaxData();
    }, []);

    const GetTaxData = () => {
        const Token = localStorage.getItem('token');

        axios
            .get('http://files.covaiciviltechlab.com/pending_payment', {
                headers: {
                    Authorization: `Token ${Token}`,
                },
            })
            .then((res) => {
                setDataSource(res.data.pending_payments);
                setFilterData(res.data.pending_payments);
            })
            .catch((error: any) => {
                if (error.response.status === 401) {
                    router.push('/');
                }
            });
    };

    const columns = [
        {
            title: 'Invoice No',
            dataIndex: 'invoice_no',
            key: 'invoice_no',
            className: 'singleLineCell',
            width: 100,
            render: (text: any, record: any) => (
                <span style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={() => handleRowClick(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Customer Name',
            dataIndex: 'customer',
            key: 'customer',
            className: 'singleLineCell',
        },
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
            className: 'singleLineCell',
        },
        {
            title: 'Incompleted Test',
            dataIndex: 'incompleted_test',
            key: 'incompleted_test',
            className: 'singleLineCell',
            width: 150,
        },
        {
            title: 'Advance',
            dataIndex: 'advance',
            key: 'advance',
            className: 'singleLineCell',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            className: 'singleLineCell',
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            className: 'singleLineCell',
        },
    ];

    const handleRowClick = (record: any) => {
        window.location.href = `/invoice/edit?id=${record.id}`;
    };

    // input search
    const inputChange = (e: any) => {
        const SearchValue = e.target.value;

        const filteredData = dataSource.filter((item: any) => {
            return (
                item.invoice_no.includes(SearchValue) ||
                item.customer.toLowerCase().includes(SearchValue.toLowerCase()) ||
                item.project_name.toLowerCase().includes(SearchValue.toLowerCase()) ||
                item.total_amount.includes(SearchValue) ||
                item.advance.includes(SearchValue) ||
                item.balance.includes(SearchValue) ||
                item.incompleted_test.includes(SearchValue)
            );
        });
        setFilterData(filteredData);
    };

    // export to excel format
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        // Add header row
        worksheet.addRow(columns.map((column) => column.title));

        // Add data rows
        filterData.forEach((row: any) => {
            worksheet.addRow(columns.map((column: any) => row[column.dataIndex]));
        });

        // Generate a Blob containing the Excel file
        const blob = await workbook.xlsx.writeBuffer();

        // Use file-saver to save the Blob as a file
        FileSaver.saveAs(
            new Blob([blob], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            'Expense-Report.xlsx'
        );
    };

    const scrollConfig: any = {
        x: true,
        y: 300,
    };

    return (
        <>
            <div className="panel">
                <div className="tax-heading-main">
                    <div>
                        <h1 className="text-lg font-semibold dark:text-white-light">Pending Payment</h1>
                    </div>
                    <div>
                        <Space>
                            <Button type="primary" onClick={exportToExcel}>
                                Export to Excel
                            </Button>
                            <Search placeholder="input search text" onChange={inputChange} enterButton className="search-bar" />
                        </Space>
                    </div>
                </div>
                <div className="table-responsive">
                    <Table dataSource={filterData} columns={columns} scroll={scrollConfig} />
                </div>
            </div>
        </>
    );
};

export default PendingPayment;
