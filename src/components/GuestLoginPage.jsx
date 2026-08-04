import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function GuestLoginPage({
    setIsLoggedIn,
    setLoggedInUser,
}) {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");

    const [contact, setContact] = useState("");

    const [category] = useState("Foundational");

    const [classYear, setClassYear] = useState("");

    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [error, setError] = useState("");

    const [contactMethod, setContactMethod] = useState("email");

    
    const [availableYears, setAvailableYears] = useState([]);

    const [loadingOptions, setLoadingOptions] = useState(true);

    const [sendingOtp, setSendingOtp] = useState(false);

    



    //--------------------------------------------------
    // SEND OTP
    //--------------------------------------------------

    const sendOtp = async () => {

        setError("");

        if (!fullName.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!contact.trim()) {
            setError("Please enter your email or mobile number.");
            return;
        }

        if (!category) {
            setError("Please select a category.");
            return;
        }

        if (!classYear) {
            setError("Please select a class year.");
            return;
        }

        console.log("Guest Details");

        console.log({

            fullName,

            contact,

            category,

            classYear,

        });
        

        try {
            setSendingOtp(true);

            const res = await fetch(`${API_BASE}/guest/send-otp`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    full_name: fullName,

                    contact_method: contactMethod,

                    contact:
                        contactMethod === "email"
                            ? contact.trim().toLowerCase()
                            : contact.trim(),

                    category: category,

                    class_year: classYear,

                }),

            });

            const data = await res.json();

            if (!res.ok) {

                setError(data.detail || "Unable to send OTP.");

                return;

            }

            setOtpSent(true);
            

        }
        catch (err) {

            console.error(err);

            setError("Unable to connect to server.");

        } finally {

            setSendingOtp(false);

        }

    };



    //--------------------------------------------------
    // VERIFY OTP
    //--------------------------------------------------

    const verifyOtp = async () => {

        setError("");

        if (!otp.trim()) {

            setError("Please enter the verification code.");

            return;

        }

        try {

            const res = await fetch(`${API_BASE}/guest/verify-otp`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    contact: contact,

                    otp: otp,

                }),

            });

            const data = await res.json();

            if (!res.ok) {

                setError(data.detail || "Invalid verification code.");

                return;

            }

            setLoggedInUser({

                user_type: data.user_type,

                full_name: data.guest.full_name,

                contact_method: data.guest.contact_method,

                contact: data.guest.contact,

                category: data.guest.category,

                class_year: data.guest.class_year,

            });

            setIsLoggedIn(true);

            navigate("/quiz");

        }
        catch (err) {

            console.error(err);

            setError("Unable to connect to server.");

        }

    };
    useEffect(() => {

        loadClassYears();

    }, []);

    const loadClassYears = async () => {
        try {

            const res = await fetch(
                `${API_BASE}/class-years-exam-module?center_code=MP001&class_name=Foundational`
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || "Unable to load class years.");
                return;
            }

            setAvailableYears(
                data.map(x => x.year_name)
            );

        } catch (err) {

            console.error(err);

            setError("Unable to load class years.");

        } finally {

            setLoadingOptions(false);

        }
    };
    return (

    <div style={styles.container}>

        <img
            src="https://gemkidsacademy.com.au/wp-content/uploads/2024/10/cropped-logo-4-1.png"
            alt="GemKids Academy"
            style={styles.logo}
        />

        <div style={styles.card}>

            {!otpSent && (

                <>

                    <h1 style={styles.heading}>

                        🎉 FREE Practice Quiz

                    </h1>

                    <p style={styles.subHeading}>

                        Discover your child's strengths with an AI-powered
                        practice quiz in just a few minutes.

                    </p>

                    <input
                        style={styles.input}
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <div style={styles.toggleContainer}>

                        <button
                            type="button"
                            style={{
                                ...styles.toggleButton,
                                ...(contactMethod === "email"
                                    ? styles.activeToggle
                                    : {})
                            }}
                            onClick={() => {

                                setContactMethod("email");

                                setContact("");

                            }}
                        >
                            Email
                        </button>

                        <button
                            type="button"
                            style={{
                                ...styles.toggleButton,
                                ...(contactMethod === "whatsapp"
                                    ? styles.activeToggle
                                    : {})
                            }}
                            onClick={() => {

                                setContactMethod("whatsapp");

                                setContact("");

                            }}
                        >
                            WhatsApp
                        </button>

                    </div>

                    <input
                        type={
                            contactMethod === "email"
                                ? "email"
                                : "tel"
                        }
                        style={styles.input}
                        placeholder={
                            contactMethod === "email"
                                ? "Email Address"
                                : "WhatsApp Number (e.g. +61412345678)"
                        }
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />

                    <select
                        style={styles.input}
                        value={category}
                        disabled
                    >
                        <option value="Foundational">
                            Foundational
                        </option>
                    </select>
                    <select
                        style={styles.input}
                        disabled={loadingOptions}
                        value={classYear}
                        onChange={(e) =>
                            setClassYear(e.target.value)
                        }
                    >

                        <option value="">
                            Select Class Year
                        </option>

                        {[...new Set(availableYears)].map(year => (

                            <option
                                key={year}
                                value={year}
                            >
                                {year}
                            </option>

                        ))}

                    </select>

                    <button
                        style={styles.button}
                        disabled={sendingOtp ||loadingOptions}
                        onClick={sendOtp}
                    >

                        Send Verification Code

                    </button>

                    <div style={styles.features}>

                        <div style={styles.featureItem}>
                            ✅ Instant Access
                        </div>

                        <div style={styles.featureItem}>
                            🤖 AI Generated Questions
                        </div>

                        

                        <div style={styles.featureItem}>
                            🎁 Free to Try
                        </div>

                    </div>

                </>

            )}

            {otpSent && (

                <>

                    <h1 style={styles.heading}>

                        Verify Your Account

                    </h1>

                    <p style={styles.subHeading}>

                        We've sent a verification code to

                        <br />

                        <strong>{contact}</strong>

                    </p>

                    <input
                        style={styles.input}
                        placeholder="Enter Verification Code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                        style={styles.button}
                        onClick={verifyOtp}
                    >

                        Verify & Start Quiz

                    </button>

                </>

            )}

            {error && (

                <p style={styles.error}>

                    {error}

                </p>

            )}

        </div>

    </div>
    )
}
    const styles = {

    container:{

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        flexDirection:"column",

        minHeight:"100vh",

        background:"#f7f9fc",

        padding:"40px"

    },

    logo:{

        width:220,

        marginBottom:"25px"

    },

    card:{

        width:"100%",

        maxWidth:"560px",

        background:"#ffffff",

        borderRadius:"18px",

        padding:"45px",

        boxShadow:"0 15px 45px rgba(0,0,0,0.08)",

        textAlign:"center",

    },

    heading:{

        fontSize:"36px",

        color:"#222",

        marginBottom:"12px",

        fontWeight:"700",

    },

    subHeading:{

        fontSize:"16px",

        color:"#666",

        lineHeight:"1.7",

        marginBottom:"35px",

    },

    input:{

        width:"100%",

        padding:"15px 16px",

        marginBottom:"18px",

        borderRadius:"10px",

        border:"1px solid #d9d9d9",

        outline:"none",

        fontSize:"16px",

        boxSizing:"border-box",

        transition:"0.2s",

        background:"#fff",

    },

    button:{

        width:"100%",

        padding:"16px",

        marginTop:"10px",

        borderRadius:"10px",

        border:"none",

        background:"#2E9B43",

        color:"#fff",

        cursor:"pointer",

        fontWeight:"bold",

        fontSize:"17px",

    },

    features:{

        marginTop:"35px",

        display:"grid",

        gridTemplateColumns:"1fr 1fr",

        gap:"15px",

    },

    featureItem:{

        background:"#f5f7fb",

        padding:"14px",

        borderRadius:"10px",

        fontSize:"15px",

        color:"#444",

        fontWeight:"500",

    },
    toggleContainer:{

        display:"flex",

        marginBottom:"18px",

        borderRadius:"10px",

        overflow:"hidden",

        border:"1px solid #d9d9d9",

    },
    toggleButton:{

        flex:1,

        padding:"14px",

        border:"none",

        background:"#ffffff",

        cursor:"pointer",

        fontSize:"16px",

        fontWeight:"600",

    },
    activeToggle:{

        background:"#2E9B43",

        color:"#ffffff",

    },

    error:{

        color:"#d32f2f",

        marginTop:"20px",

        fontWeight:"600",

    }

};

