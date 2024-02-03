import React, { useState, useEffect } from 'react';
import { Space, Table, Modal } from 'antd';
import { Button, Drawer } from 'antd';
import { Form, Input, message, Upload, Select } from 'antd';
import { EditOutlined, EyeOutlined, InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { UploadProps } from 'antd';
import router from 'next/router';

const InvoiceFileUpload = () => {
    const { Search } = Input;
    const [form] = Form.useForm();

    const [open, setOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<any>(null);
    const [drawerTitle, setDrawerTitle] = useState('Create File Upload');
    const [viewRecord, setViewRecord] = useState<any>(null);
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formFields, setFormFields] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [fileshow, setFileShow] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fileInputData, setFileInputData] = useState<any>({
        file: null,
    });

    useEffect(() => {
        const Token = localStorage.getItem('token');

        axios
            .get('http://files.covaiciviltechlab.com/create_invoice_file_upload/', {
                headers: {
                    Authorization: `Token ${Token}`,
                },
            })
            .then((res) => {
                setFormFields(res?.data);
            })
            .catch((error: any) => {
                if (error.response.status === 401) {
                    router.push('/');
                }
            });
    }, []);

    useEffect(() => {
        if (editRecord) {
            setDrawerTitle('Edit File Upload');
        } else {
            setDrawerTitle('Create File Upload');
        }
    }, [editRecord, open]);

    // get Tax datas
    useEffect(() => {
        getFileUpload();
    }, []);

    const getFileUpload = () => {
        const Token = localStorage.getItem('token');

        axios
            .get('http://files.covaiciviltechlab.com/invoice_file_upload_list/', {
                headers: {
                    Authorization: `Token ${Token}`,
                },
            })
            .then((res) => {
                setDataSource(res?.data?.invoice_files);
                setFilterData(res?.data?.invoice_files);
            })
            .catch((error: any) => {
                if (error.response.status === 401) {
                    router.push('/');
                } else {
                }
            });
    };

    const handleCategoryChange = (value: any) => {
        setSelectedCategory(value);
        form.resetFields(['invoice', 'expense']);
    };

    // Model
    const showModal = (record: any) => {
        setIsModalOpen(true);
        setViewRecord(record);
        modalData();
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // drawer
    const showDrawer = (record: any) => {
        console.log('✌️record --->', record);
        console.log('fileInputData.file', fileInputData.file);

        if (record) {
            setFileShow(record.file_url);
            setEditRecord(record);
            setSelectedCategory(record.category);
            form.setFieldsValue({
                invoice: record.invoice,
                category: record.category,
                expense: record.expense,
            });
            setFileInputData({ ...fileInputData, file: fileInputData.file?.name });
        } else {
            setEditRecord(null);
            form.resetFields();
            setFileShow('');
        }
        setOpen(true);
    };
    console.log('File show:', fileshow);

    const onClose = () => {
        setOpen(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            className: 'singleLineCell',
        },
        {
            title: 'Category',
            dataIndex: 'category_name',
            key: 'category_name',
            className: 'singleLineCell',
        },
        {
            title: 'Invoice No',
            dataIndex: 'invoice_no',
            key: 'invoice_no',
            className: 'singleLineCell',
        },
        {
            title: 'Expense',
            dataIndex: 'expense_category',
            key: 'expense_category',
            className: 'singleLineCell',
        },
        {
            title: 'File Url',
            dataIndex: 'file_url',
            key: 'file_url',
            className: 'singleLineCell',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <a href={record.file_url} download target="_blank" rel="noopener noreferrer">
                        Download
                    </a>
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            className: 'singleLineCell',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <EyeOutlined style={{ cursor: 'pointer' }} onClick={() => showModal(record)} className="view-icon" rev={undefined} />

                    {localStorage.getItem('admin') === 'true' ? (
                        <EditOutlined style={{ cursor: 'pointer' }} onClick={() => showDrawer(record)} className="edit-icon" rev={undefined} />
                    ) : (
                        <EditOutlined style={{ cursor: 'pointer', display: 'none' }} onClick={() => showDrawer(record)} className="edit-icon" rev={undefined} />
                    )}

                    {/* <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => showDrawer(record)}
            className='edit-icon' rev={undefined} />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleDelete(record)} className='delete-icon' rev={undefined} /> */}
                </Space>
            ),
        },
    ];

    // input search
    const [filterData, setFilterData] = useState(dataSource);
    const inputChange = (e: any) => {
        setFilterData(
            dataSource.filter((item: any) => {
                return (
                    item.category_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item?.expense_category?.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    item?.invoice_no?.includes(e.target.value)
                );
            })
        );
    };
    console.log('fileInputData', fileInputData.file);

    // form submit
    const onFinish = (values: any) => {
        console.log('✌️values --->', values);

        const Token = localStorage.getItem('token');

        // Append the file from the values object
        const formData = new FormData();
        formData.append('file', fileInputData.file);

        if (values.invoice !== undefined) {
            formData.append('invoice', values.invoice);
        }
        formData.append('category', values.category);
        if (values.expense !== undefined) {
            formData.append('expense', values.expense);
        }

        console.log('formData', formData);

        if (editRecord) {
            axios
                .put(`http://files.covaiciviltechlab.com/edit_invoice_file_upload/${editRecord.id}/`, formData, {
                    headers: {
                        Authorization: `Token ${Token}`,
                        'Content-Type': 'multipart/form-data', // Set content type for file upload
                    },
                })
                .then((res: any) => {
                    console.log('✌️res --->', res);
                    getFileUpload();
                    setOpen(false);
                })
                .catch((error: any) => {
                    if (error.response.status === 401) {
                        router.push('/');
                    }
                });
        } else {
            axios
                .post('http://files.covaiciviltechlab.com/create_invoice_file_upload/', formData, {
                    headers: {
                        Authorization: `Token ${Token}`,
                        'Content-Type': 'multipart/form-data', // Set content type for file upload
                    },
                })
                .then((res: any) => {
                    getFileUpload();
                    setOpen(false);
                    setFileShow('');
                })
                .catch((error: any) => {
                    if (error.response.status === 401) {
                        router.push('/');
                    }
                });
            form.resetFields();
        }
        onClose();
    };

    const onFinishFailed = (errorInfo: any) => {};

    // Model Data
    const modalData = () => {
        const formatDate = (dateString: any) => {
            if (!dateString) {
                return 'N/A'; // or handle it according to your requirements
            }

            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return 'Invalid Date'; // or handle it according to your requirements
            }

            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        };

        const data = [
            {
                label: 'Category:',
                value: viewRecord?.category_name || 'N/A',
            },
            {
                label: 'Invoice:',
                value: viewRecord?.invoice || 'N/A',
            },
            {
                label: 'Expense:',
                value: viewRecord?.expense_category || 'N/A',
            },
            {
                label: 'Download:',
                value: viewRecord?.file_url || 'N/A',
            },

            {
                label: 'Created By:',
                value: viewRecord?.created_by || 'N/A',
            },
            {
                label: 'Created Date:',
                value: formatDate(viewRecord?.created_date) || 'N/A',
            },
            {
                label: 'Modified By:',
                value: viewRecord?.modified_by || 'N/A',
            },
            {
                label: 'Modified Date:',
                value: formatDate(viewRecord?.modified_date) || 'N/A',
            },
        ];

        return data;
    };

    const scrollConfig: any = {
        x: true,
        y: 300,
    };

    const removeFile = () => {
        setFileShow('');
    };


    const selectFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;
            const fileSize = file.size / 1024 / 1024; // Convert size to MB
            if (fileType === 'application/pdf' || fileType.includes('spreadsheet')) {
                if (fileSize <= 2) {
                    setFileInputData({ file });
                } else {
                    // Display error message or handle the invalid file size
                    console.log('File size exceeds the limit of 2 MB.');
                    setErrorMessage('File size exceeds the limit of 2 MB.');
                }
            } else {
                // Display error message or handle the invalid file type
                console.log('Invalid file type. Please select a PDF or Excel sheet file.');
            }
        }
    }

    const url = fileshow;
    const filenames = url.substring(url.lastIndexOf('/') + 1); // Extracts the filename from the URL
    const fileType = filenames.substring(filenames.lastIndexOf('.') + 1);

    return (
        <>
            <div className="panel">
                <div className="tax-heading-main">
                    <div>
                        <h1 className="text-lg font-semibold dark:text-white-light">Expense/Invoice File Upload</h1>
                    </div>
                    <div>
                        <Search placeholder="Input search text" onChange={inputChange} enterButton className="search-bar" />
                        <button
                            type="button"
                            onClick={() => {
                                showDrawer(null);
                            }}
                            className="create-button"
                        >
                            + File Upload
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                    <Table dataSource={filterData} columns={columns} pagination={false} scroll={scrollConfig} />
                </div>

                <Drawer title={drawerTitle} placement="right" width={600} onClose={onClose} open={open}>
                    <Form name="basic" layout="vertical" form={form} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                        <Form.Item label="Category" name="category" required={true} rules={[{ required: true, message: 'Category field is required.' }]}>
                            <Select placeholder="Select a Category" onChange={handleCategoryChange}>
                                {formFields?.categories?.map((val: any) => (
                                    <Select.Option key={val.id} value={val.id}>
                                        {val.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {selectedCategory === 2 && (
                            <Form.Item label="Invoice" name="invoice" required={true} rules={[{ required: true, message: 'Invoice field is required.' }]}>
                                <Select placeholder="Select an Invoice">
                                    {formFields?.invoices?.map((val: any) => (
                                        <Select.Option key={val.id} value={val.id}>
                                            {val.invoice_no} - {val.customer} - {val.customer_no}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}

                        {selectedCategory === 3 && (
                            <Form.Item label="Expense Entry" name="expense" required={true} rules={[{ required: true, message: 'Expense field is required.' }]}>
                                <Select placeholder="Select an Expense Entry">
                                    {formFields?.expense_entries?.map((val: any) => (
                                        <Select.Option key={val.id} value={val.id}>
                                            {val.expense_user} - {val.expense_category_name} - {val.amount}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}

                        <label>Invoice File Upload</label>
                        {fileshow ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p style={{ padding: '5px 20px', border: '1px solid #d9d9d9', borderRadius: '7px' }}>{filenames}</p>
                                    <Button onClick={() => removeFile()}>Remove File</Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".pdf, .xls, .xlsx"
                                    onChange={selectFileChange}
                                    required
                                />
                                <p style={{ color: 'red' }}>{errorMessage}</p>
                            </>
                        )}

                        <Form.Item>
                            <div className="form-btn-main" style={{ marginTop: '20px' }}>
                                <Space>
                                    <Button danger htmlType="submit" onClick={() => onClose()}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Space>
                            </div>
                        </Form.Item>
                    </Form>
                </Drawer>

                {/* Modal */}
                <Modal title="View File" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                    <div style={{ overflow: 'scroll' }}>
                        {modalData()?.map((value: any) => {
                            return (
                                <>
                                    <div className="content-main">
                                        <p className="content-1">{value?.label}</p>
                                        <p className="content-2">{value?.value}</p>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default InvoiceFileUpload;
