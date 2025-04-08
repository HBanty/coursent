
import React, { useEffect, useState } from 'react'
import logo from '../../public/logo.webp'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";


import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';


function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //token
   useEffect(()=>{
    const token = localStorage.getItem("user");
    if(token) {
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
   },[]);

//fetching courses
useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:4001/api/v1/course/courses`, {
        withCredentials: true,
      });
      console.log(response.data.courses);
      setCourses(response.data.courses);
    } catch (error) {
      console.log("error in fetchCourses ", error);
    }
  };
  fetchCourses();
}, []);
  //logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`http://localhost:4001/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {

      console.log("Error in Logout", error);
      toast.error(error.response.data.errors || "Error in Loggging out")
    }

  }


  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };





  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-black to-blue-950 overflow-hidden">
<div className="h-[1250px] md:h-[1050px] text-white container mx-auto w-full px-0">
        {/* 3:20 time laps */}
        {/* header */}
        <header className='flex items-center justify-between p-6'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt="" className='w-10 h-10 rounded-full' />
            <h1 className='text-2xl text-orange-500 font-bold'>CourSent</h1>
          </div>
          <div className='space-x-4'>
            {isLoggedIn ? (
              <button
              onClick={handleLogout}
                className='bg-transparent text-white py-2 px-4 border border-white rounded'>
                Logout
              </button>

            ) : (
              <>
                <Link to={"/login"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>Login</Link>
                <Link to={"/signup"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>Signup</Link>
                </>
              )}
          </div>
        </header>


        {/* main  3:30*/}
        <section className='text-center py-20'>
          <h1 className='text-4xl font-semibold text-orange-500 '>CourSent</h1>
          <br />
          <p className='text-gray-500'>Sharpen your skills with courses crafted by experts.</p>
          <div className='space-x-4 mt-8'>
            <Link to ={"/courses"} className='bg-green-600 text-white py-3 px-6  rounded font-semibold hover:bg-white duration-300 hover:text-black'>Explore courses</Link>
            <Link to ={"http://www.youtube.com/@yourtimepass1031"} className='bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-600 duration-300 hover:text-white'>courses vedio</Link>
          </div>
        </section>

        {/* */}
        <section> <Slider {...settings}>{
          courses.map((course) => (

            <div key={course._id} className='p-4'>
              <div className='relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105'>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <img className='h-32 w-full object-contain' src={course.image.url} alt="" />
                  <div className='p-6 text-center'>
                    <h2 className='text-xl font-bold text-white'>{course.title}</h2>
                    <button className="mt-8 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300">Enroll Now </button>
                  </div>
                </div>
              </div>
            </div>
          )

          )}



        </Slider></section>

        <hr />
        {/* footer 3:35  */}
        <footer className='my-8'>
          <div className='grid grid-c-1 md:grid-cols-3'>
            <div className='flex flex-col items-center md:items-start'>
              <div className='flex items-center space-x-2'>
                <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                <h1 className='text-2xl text-orange-500 font-bold'>CourSent</h1>
              </div>
              <div className='mt-3 ml-2 md:ml-8'>
                <p className='mb-2'>Follow us </p>
                <div className='flex space-x-4 mb-2'>
                  <a href=""><FaFacebook className='hover:text-blue-400 duration-300' /></a>
                  <a href=""><FaInstagram className='hover:text-pink-600 duration-300' /></a>
                  <a href=""><FaXTwitter className='hover:text-blue-600 duration-300' /></a>
                </div>
              </div>
            </div>
            <div className='items-center flex flex-col'>
              <h3 className='text-lg font-semibold mb-4'>connects</h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer duration-300'>youtube-ch link</li>
                <li className='hover:text-white cursor-pointer duration-300'>teligram- id link</li>
                <li className='hover:text-white cursor-pointer duration-300'>Github- pr link</li>
              </ul>
            </div>
            <div className='items-center flex flex-col'>
              <h3 className='text-lg font-semibold mb-4'>copyrghts &#169; 2024</h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer duration-300'>Terms & Conditions</li>
                <li className='hover:text-white cursor-pointer duration-300'>Privacy Policy</li>
                <li className='hover:text-white cursor-pointer duration-300'> Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>

    </div>
  )
}

export default Home;
