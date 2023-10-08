import React, { useEffect, useState } from "react";
import { Button, Modal, Select } from "@mantine/core";
import API from "../global/api";
import { useNavigate, useSearchParams } from "react-router-dom";

const BookList = () => {
    const nav = useNavigate()
    let initialState = {
        category_id: null,
        name: "",
        author: '',
        price: null
    }
    let search = {
        category: "",
        name: "",
        author: ""
    }
    const [refresh, setRefresh] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [bookData, setBookData] = useState(initialState);
    const [searchQuery, setSearchQuery] = useState(search);
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    let [searchParams, setSearchParams] = useSearchParams()
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addBook = () => {
        try {
            API.post('/books', bookData).then(res => res.data.status_code === 200 && setRefresh(!refresh)).catch(err => console.log(err))


            setBookData(initialState);

            closeModal();
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };

    const updateBook = () => {

        API.patch(`/books/${updateId}`, bookData).then(res => setRefresh(!refresh)).catch(err => console.log(err))
        closeModal()
    }
    const deleteBook = (id) => {
        let result=confirm('Are you sure want to delete')
        result && API.delete(`/books/${id}`).then(res => setRefresh(!refresh)).then(err => console.log(err))
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookData({
            ...bookData,
            [name]: value,
        });
    }
    const handleSearch = (e) => {
        const { name, value } = e.target;
        setSearchQuery({
            ...searchQuery,
            [name]: value,
        });
    }
    const enterListenHandler = e => {
        if (e.key === "Enter") {
            setSearchParams(searchQuery)

            setRefresh(!refresh)
        }
    };
    useEffect(() => {
        setLoading(true);
        API.get(`/books?name=${searchQuery.name}&category=${searchQuery.category}&author=${searchQuery.author}`)
            .then(res => {
                setBooks(res.data.data)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
        API.get('/categories')
            .then(res => {
                setCategories(res.data.data)
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
                <h1 className="text-4xl text-white font-medium">Book List</h1>
                <button onClick={() => { setIsUpdate(false); setBookData(initialState); openModal() }} className="px-5 py-3 bg-primary text-white rounded-md"
                >
                    Add Book
                </button>

            </div>
            <>
                <div>
                    {/* Header */}
                    <div className="grid grid-cols-12 items-center text-white text-center text-base font-semibold">
                        <div className="col-span-1">No.</div>
                        <div className="col-span-2">
                            <p>Name</p>
                            <div className="name">
                                <input type="search" className="text-black outline-none px-1 border w-40" value={searchQuery.name} onChange={(e) => handleSearch(e)} onKeyDown={(e) => enterListenHandler(e)} name="name" id="" />
                            </div>
                        </div>
                        <div className="col-span-3">
                            Category
                            <div className="name">
                                <input type="search" className="text-black outline-none px-1 border w-40" value={searchQuery.category} onChange={(e) => handleSearch(e)} onKeyDown={(e) => enterListenHandler(e)} name="category" id="" />
                            </div>
                        </div>
                        <div className="col-span-2">
                            Author
                            <div className="name">
                                <input type="search" className="text-black outline-none px-1 border w-40" value={searchQuery.author} onChange={(e) => handleSearch(e)} onKeyDown={(e) => enterListenHandler(e)} name="author" id="" />
                            </div>
                        </div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Action</div>
                    </div>

                    {/* Table row */}
                    {
                        books && books.map((book, index) =>

                        (<div key={book.id}>
                            <div className="grid grid-cols-12 items-center text-center bg-white text-secondary rounded-xl py-3 my-2 transition-colors hover:text-white hover:bg-gray-700">
                                <p className="col-span-1 flex justify-center" >
                                    {++index}
                                </p>


                                <p className="col-span-2">{book.name}</p>
                                <p className="col-span-3">{book.category}</p>
                                <p className="col-span-2">{book.author}</p>
                                <p className="col-span-2">{book.price}</p>

                                <div className="col-span-2  text-blue-500 underline cursor-pointer flex items-center justify-center gap-3">
                                    <p
                                        onClick={() => {
                                            setIsUpdate(true)
                                            setUpdateId(book.id)
                                            setBookData(book)
                                            openModal()
                                        }}
                                    >
                                        Edit
                                    </p>
                                    <p onClick={(e) => deleteBook(book.id)}>Delete</p>
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
                    title={isUpdate ? 'Update Book' : 'Cteate Book'}
                    size="md"
                >
                    {/* <p className="text-red-500">{error}</p> */}
                    <div className="flex flex-col justify-center gap-10 w-full h-full">
                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="name">Book Name</label>
                            <input
                                type="text"
                                className=" outline-none px-3 py-2 border"
                                placeholder="Enter Book name..."
                                name="name"
                                value={bookData.name}
                                onChange={(e) => handleInputChange(e)}
                                required
                            />

                        </div>

                        <div className="flex flex-col gap-3">
                            <label className=" " htmlFor="">
                                Choose Category
                            </label>
                            <select
                                className="py-2 px-5 outline-none"
                                name="category_id"
                                id=""
                                value={bookData.category_id}
                                onChange={(e) => handleInputChange(e)}
                            >
                                <option value="">Select an option</option>
                                {
                                    categories.map(category => (<option value={category.id} key={category.id}>{category.name}</option>))
                                }

                            </select>
                        </div>

                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="name">Author</label>
                            <input
                                type="text"
                                className=" outline-none px-3 py-2 border"
                                placeholder="Enter Author..."
                                name="author"
                                value={bookData.author}
                                onChange={(e) => handleInputChange(e)}
                                required
                            />

                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="name">Price</label>
                            <input
                                type="text"
                                className=" outline-none px-3 py-2 border"
                                placeholder="Enter Price..."
                                name="price"
                                value={bookData.price}
                                onChange={(e) => handleInputChange(e)}
                                required
                            />

                        </div>

                        <div className="flex justify-around">
                            <Button variant="primary" onClick={isUpdate ? updateBook : addBook}>
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

export default BookList;
