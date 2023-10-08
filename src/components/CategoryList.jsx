import React, { useEffect, useState } from "react";
import { Button, Modal, Select } from "@mantine/core";
import API from "../global/api";

const CategoryList = () => {

    const [refresh, setRefresh] = useState(true);
    const [loading, setLoading] = useState(true); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);


    const addCategory = () => {
        try {
            API.post('/categories',{name:categoryName}).then(res=>res.data.status_code===200 && setRefresh(!refresh)).catch(err=>console.log(err))


            setCategoryName('');

            closeModal();
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };
    const updateCategory = ()=>{

        API.patch(`/categories/${updateId}`,{name:categoryName}).then(res=>setRefresh(!refresh)).catch(err=>console.log(err))
        closeModal()
    }
    const deleteCategory = (id)=>{
        let result=confirm('Are you sure want to delete')
        result && API.delete(`/categories/${id}`).then(res=>setRefresh(!refresh)).then(err=>console.log(err))
    }

    useEffect(() => {
        setLoading(true);
        API.get('/categories')
            .then(res => {
                setCategories(res.data.data)
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
                <h1 className="text-4xl text-white font-medium">Category List</h1>
                <button onClick={() => {setIsUpdate(false);setCategoryName(''); openModal()}} className="px-5 py-3 bg-primary text-white rounded-md"
                >
                    Add Category
                </button>

            </div>
            <>
                <div>
                    {/* Header */}
                    <div className="grid grid-cols-12 items-center text-white text-center text-base font-semibold">
                        <h1 className="col-span-2">No.</h1>
                        <h1 className="col-span-7">Category</h1>
                        <h1 className="col-span-3">Action</h1>
                    </div>

                    {/* Table row */}
                    {
                        categories && categories.map((category,index) => 

                            (<div key={category.id}>
                                <div className="grid grid-cols-12 items-center text-center bg-white text-secondary rounded-xl py-3 my-2 transition-colors hover:text-white hover:bg-gray-700">
                                    <p className="col-span-2 flex justify-center" >
                                        {++index}
                                    </p>


                                    <p className="col-span-7">{category.name}</p>

                                    <div className="col-span-3  text-blue-500 underline cursor-pointer flex items-center justify-center gap-3">
                                        <p
                                            onClick={() => {
                                                setIsUpdate(true)
                                                setUpdateId(category.id)
                                                setCategoryName(category.name)
                                                openModal()
                                            }}
                                        >
                                            Edit
                                        </p>
                                        <p onClick={(e) => deleteCategory(category.id)}>Delete</p>
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
                    title={isUpdate?'Update Category':'Cteate Category'}
                    size="md"
                >
                    {/* <p className="text-red-500">{error}</p> */}
                    <div className="flex flex-col justify-center gap-10 w-full h-full">
                        <div className="flex flex-col w-full gap-5 mt-5">
                            <input
                                type="text"
                                className=" outline-none px-3 py-2 border"
                                placeholder="Enter Category name..."
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />

                        </div>

                        {/* select category  */}
                        {/* <div className="flex flex-col gap-3">
                            <label className="font-bold " htmlFor="">
                                Choose Category
                            </label>
                            <select
                                className="py-2 px-5 outline-none"
                                name=""
                                id=""
                                value={cate}
                                onChange={(e) => setCate(e.target.value)}
                            >
                                <option value="">Select an option</option>
                                <option value="music">Music</option>
                                <option value="sport">Sport</option>
                            </select>
                        </div> */}

                        <div className="flex justify-around">
                            <Button variant="primary" onClick={ isUpdate?updateCategory: addCategory}>
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

export default CategoryList;
