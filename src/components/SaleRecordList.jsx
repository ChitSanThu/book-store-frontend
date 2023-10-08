import React, { useEffect, useState } from "react";
import { Button, Modal } from "@mantine/core";
import API from "../global/api";

const SaleRecordList = () => {
    let initialState = {
        book_id: null,
        customer_name: "",
        quantity: 1,
        amount: null,
        paid: null,
        due: null
    }
    const [refresh, setRefresh] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [totalPaid, setTotalPaid] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);
    const [saleData, setSaleData] = useState(initialState);
    const [saleRecords, setSaleRecords] = useState([]);
    const [books, setBooks] = useState([]);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addSaleRecord = () => {
        try {
            API.post('/sale_records', saleData).then(res => res.data.status_code === 200 && setRefresh(!refresh)).catch(err => console.log(err))


            setSaleData(initialState);

            closeModal();
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    const updateSaleRecord = () => {

        API.patch(`/sale_records/${updateId}`, saleData).then(res => setRefresh(!refresh)).catch(err => console.log(err))
        closeModal()
    }
    const deleteSaleRecord = (id) => {
        let result = confirm('Are you sure want to delete')
        result && API.delete(`/sale_records/${id}`).then(res => setRefresh(!refresh)).then(err => console.log(err))
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name == "quantity") {
            const book_price = books.filter(({ id }) => id == saleData.book_id)[0].price
            setSaleData({
                ...saleData,
                amount: book_price * value,
                [name]: value,
            });
        } else if (name == "book_id") {
            const book_price = books.filter(({ id }) => id == value)[0].price
            setSaleData({
                ...saleData,
                amount: book_price * saleData.quantity,
                [name]: value,
            });
        } else if (name == "paid") {
            setSaleData({
                ...saleData,
                [name]: value,
                due: saleData.amount - value
            })
        } else {

            setSaleData({
                ...saleData,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        setLoading(true);
        API.get('/sale_records')
            .then(res => {
                setSaleRecords(res.data.data.sale_records)
                setTotalAmount(res.data.data.total_amount)
                setTotalPaid(res.data.data.total_paid)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
        API.get('/books')
            .then(res => {
                setBooks(res.data.data)
            })
            .catch(err => console.log(err))

    }, [refresh]);


    if (loading) {
        return (
            <div className="text-white flex flex-col w-full justify-center items-center gap-5 h-[60vh]">
                <p>Wait a moment. . . </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 px-5 mt-10">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl text-white font-medium">Sale Record List</h1>
                <p className="text-white">Total Amount = {totalAmount}</p>
                <p className="text-white">Total Paid = {totalPaid}</p>
                <button onClick={() => { setIsUpdate(false); setSaleData(initialState); openModal() }} className="px-5 py-3 bg-primary text-white rounded-md"
                >
                    Add Sale Record
                </button>

            </div>
            <>
                <div>
                    {/* Header */}
                    <div className="grid grid-cols-12 items-center text-white text-center text-base font-semibold">
                        <h1 className="col-span-1">No.</h1>
                        <h1 className="col-span-1">Sell Id</h1>
                        <h1 className="col-span-2">Customer Name</h1>
                        <h1 className="col-span-2">Amount</h1>
                        <h1 className="col-span-1">Paid</h1>
                        <h1 className="col-span-1">Due</h1>
                        <h1 className="col-span-2">Sale Date</h1>
                        <h1 className="col-span-2">Action</h1>
                    </div>

                    {/* Table row */}
                    {
                        saleRecords && saleRecords.map((record, index) =>

                        (<div key={record.id}>
                            <div className="grid grid-cols-12 items-center text-center bg-white text-secondary rounded-xl py-3 my-2 transition-colors hover:text-white hover:bg-gray-700">
                                <p className="col-span-1 flex justify-center" >
                                    {++index}
                                </p>


                                <p className="col-span-1">{record.sale_id}</p>
                                <p className="col-span-2">{record.customer_name}</p>
                                <p className="col-span-2">{record.amount}</p>
                                <p className="col-span-1">{record.paid}</p>
                                <p className="col-span-1">{record.due}</p>
                                <p className="col-span-2">{record.sale_date}</p>

                                <div className="col-span-2  text-blue-500 underline cursor-pointer flex items-center justify-center gap-3">
                                    <p
                                        onClick={() => {
                                            setIsUpdate(true)
                                            setUpdateId(record.id)
                                            setSaleData(record)
                                            openModal()
                                        }}
                                    >
                                        Edit
                                    </p>
                                    <p onClick={(e) => deleteSaleRecord(record.id)}>Delete</p>
                                </div>
                            </div>
                        </div>)
                        )
                    }

                </div>

                {/* Modal */}
                <Modal
                    opened={isModalOpen}
                    onClose={closeModal}
                    title={isUpdate ? 'Update Sale Record' : 'Cteate Sale Record'}
                    size="md"
                >
                    {/* <p className="text-red-500">{error}</p> */}
                    <div className="flex flex-col justify-center gap-10 w-full h-full">
                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="name">Customer Name</label>
                            <input
                                type="text"
                                className=" outline-none px-3 py-2 border"
                                placeholder="Enter Customer name..."
                                name="customer_name"
                                value={saleData.customer_name}
                                onChange={(e) => handleInputChange(e)}
                                required
                            />

                        </div>

                        <div className="flex flex-col gap-3">
                            <label className=" " htmlFor="">
                                Choose Book
                            </label>
                            <select
                                className="py-2 px-5 outline-none"
                                name="book_id"
                                id=""
                                value={saleData.book_id}
                                onChange={(e) => {
                                    handleInputChange(e);

                                }}
                            >
                                <option value="">Select a book</option>
                                {
                                    books.map(book => (<option value={book.id} key={book.id}>{book.name}</option>))
                                }

                            </select>
                        </div>

                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="quantity">Quantity</label>
                            <input
                                type="number"
                                className=" outline-none px-3 py-2 border"
                                placeholder="Enter quantity..."
                                name="quantity"
                                value={saleData.quantity}
                                onChange={(e) => handleInputChange(e)}
                                required
                            />

                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="name">Amount</label>
                            <input
                                type="text"
                                readOnly
                                className=" outline-none px-3 py-2 border"
                                name="amount"
                                value={saleData.amount}
                                required
                            />

                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="name">Paid</label>
                            <input
                                type="number"
                                className=" outline-none px-3 py-2 border"
                                onChange={(e) => handleInputChange(e)}
                                name="paid"
                                value={saleData.paid}
                                required
                            />

                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="name">Due</label>
                            <input
                                type="number"
                                readOnly
                                className=" outline-none px-3 py-2 border"
                                name="due"
                                value={saleData.due}
                                required
                            />

                        </div>

                        <div className="flex justify-around">
                            <Button variant="primary" onClick={isUpdate ? updateSaleRecord : addSaleRecord}>
                                {isUpdate ? 'Update' : 'Add'}
                            </Button>

                            <Button variant="light" onClick={closeModal}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        </div>
    );
};

export default SaleRecordList;
