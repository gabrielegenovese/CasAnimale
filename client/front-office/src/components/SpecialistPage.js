import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useParams } from 'react-router-dom'
import CompanyManage from "../services/CompanyManage";

import Cookies from "js-cookie";
//import BookVetVisit from "./bookVetVisit";

const SpecialistPage = (propsingle) => {
    const params = useParams()
    const [company, setCompany] = useState([]);
    useEffect(() => {
        async function fetchData() {
          await CompanyManage.getCompany(params.id).then((res) => {
            setCompany(res.data);
          });
        }
        fetchData();
      }, []);
    
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get("token");
    return(
        <div
            data-theme="lemonade"
            className="flex h-screen flex-1"
            style={{
                flexDirection: "column",
                justifyContent: "space-between",
                maxHeight: "100%",
            }}
        >
            <div className="flex flex-1" style={{ height: "4rem", maxHeight: "4rem" }}>
                <Navbar />
            </div>

            <div className="flex flex-1 flex-col m-3" style={{ height: "auto" }}>
                <div id="vetName" className="text-3xl font-bold sm:text-5xl md:text-7xl">{company.name}</div>
                <div id="locationInfo" className="mt-3 ml-2"><span className="font-bold sm:text-xl">Doctor:</span>
                    <div id="locationList" className="ml-4">
                        {company.owner}
                    </div>
                </div>
                <div id="mainPetInfo" className="mt-3 ml-2"><span className="font-bold sm:text-xl">Main pet of interest:</span>
                    <ul id="mainPetList" className="ml-4">
                        {company.main_pets?.map((item) => (
                            <li>{item}</li>
                        ))}
                    </ul>

                </div>
                <div id="studyInfo" className="mt-3 ml-2"><span className="font-bold sm:text-xl">Study info:</span>
                    <ul id="studyList" className="ml-4">
                        {company.study_info?.map((item) => (
                            <li>{item}</li>
                        ))}
                    </ul>
                </div>
                <div id="experienceInfo" className="mt-3 ml-2"><span className="font-bold sm:text-xl">Professional experience:</span>
                    <ul id="experienceList" className="ml-4">
                        {company.professional_experience?.map((item) => (
                            <li>{item}</li>
                        ))}
                    </ul>
                </div>
                <div id="jobInfo" className="mt-3 ml-2"><span className="font-bold sm:text-xl">Actual jobs:</span>
                    <ul id="jobList" className="ml-4">
                        {company.actual_jobs?.map((item) => (
                            <li>{item}</li>
                        ))}
                    </ul>
                </div>
                <div id="locationInfo" className="mt-3 ml-2"><span className="font-bold sm:text-xl">Workplaces:</span>
                    <ul id="locationList" className="ml-4">
                        {company.cities?.map((item) => (
                            <li>{item}</li>
                        ))}
                    </ul>
                </div>
                {/*<div id="bookBtn" className="flex flex-1 justify-center">
                    <button className="btn btn-primary" onClick={() => {navigate("/bookVetVisit")}}>Book a visit</button>
                </div>*/}

                {token ? (
                    <div className="flex flex-1 justify-center">
                        <button
                        onClick={() => {
                            setShowModal(true);
                        }}
                        className="btn btn-secondary mt-2 mb-4"
                        >
                        Book a visit
                        </button>
                    </div>
                ) : <div className="flex flex-1 justify-center"><button className="btn btn-secondary" onClick={() => {navigate("/login");}}>Sign in to book a visit</button></div>}

                {showModal ? (
                    <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-full my-6 mx-auto max-w-3xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-3xl font-semibold">Book a visit!</h3>
                            </div>
                            {/*body*/}
                            <div className="relative p-6 flex-auto">
                            {/*<BookVetVisit style={{ display: "flex", height: "100%" }} />*/}
                            </div>
                            {/*footer*/}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="opacity-10 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}

            </div>
            <div className="flex flex-1" style={{ height: "auto" }}>
                <Footer />
            </div>
        </div>
    );
};
export default SpecialistPage;