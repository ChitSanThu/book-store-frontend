import React, { useEffect, useState } from "react";
import { Button, Modal, Select } from "@mantine/core";
import API from "../global/api";

const CustomerList = () => {
    let initialState={
        name:"",
    }
    const [refresh, setRefresh] = useState(true);
    const [loading, setLoading] = useState(true); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [customerData, setCustomerData] = useState(initialState);
    const [customers, setCustomers] = useState(initialState);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addCustomer = () => {
        try {
            API.post('/customers',customerData).then(res=>res.data.status_code===200 && setRefresh(!refresh)).catch(err=>console.log(err))

            setCustomerData(initialState);

            closeModal();
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    const updateCustomer = ()=>{

        API.patch(`/customers/${updateId}`,customerData).then(res=>setRefresh(!refresh)).catch(err=>console.log(err))
        closeModal()
    }
    const deleteCustomerData = (id)=>{
        let result=confirm('Are you sure want to delete.It also delete related sale records with customer')
        result && API.delete(`/customers/${id}`).then(res=>setRefresh(!refresh)).then(err=>console.log(err))
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerData({
          ...customerData,
          [name]: value,
        });
      };

    useEffect(() => {
        setLoading(true);
        API.get('/customers')
            .then(res => {
                setCustomers(res.data.data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
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
                <h1 className="text-4xl text-white font-medium">Customer List</h1>
            </div>
            <>
                <div>
                    {/* Header */}
                    <div className="grid grid-cols-12 items-center text-white text-center text-base font-semibold">
                        <h1 className="col-span-2">No.</h1>
                        <h1 className="col-span-5">Name</h1>
                        <h1 className="col-span-3">Order Count</h1>
                        <h1 className="col-span-2">Action</h1>
                    </div>

                    {/* Table row */}
                    {
                        customers && customers.map((customer,index) => 

                            (<div key={customer.id}>
                                <div className="grid grid-cols-12 items-center text-center bg-white text-secondary rounded-xl py-3 my-2 transition-colors hover:text-white hover:bg-gray-700">
                                    <p className="col-span-2 flex justify-center" >
                                        {++index}
                                    </p>


                                    <p className="col-span-5">{customer.name}</p>
                                    <p className="col-span-3">{customer.sale_record_count}</p>

                                    <div className="col-span-2  text-blue-500 underline cursor-pointer flex items-center justify-center gap-3">
                                        <p
                                            onClick={() => {
                                                setIsUpdate(true)
                                                setUpdateId(customer.id)
                                                setCustomerData(customer)
                                                openModal()
                                            }}
                                        >
                                            Edit
                                        </p>
                                        <p onClick={(e) => deleteCustomerData(customer.id)}>Delete</p>
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
                    title={isUpdate?'Update Customer':'Cteate Customer'}
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
                                name="name"
                                value={customerData.name}
                                onChange={(e) => handleInputChange(e)}
                                required
                            />

                        </div>

                        <div className="flex justify-around">
                            <Button variant="primary" onClick={ isUpdate?updateCustomer: addCustomer}>
                                {isUpdate?'Update':'Add'} 
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

export default CustomerList;
