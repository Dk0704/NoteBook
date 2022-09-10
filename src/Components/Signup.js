import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [creds, setCreds] = useState({ name: "", email: "", password: "", cpassword: "" });
    const history = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, cpassword } = creds;
        // if (password === cpassword) {
            const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });
            const json = await response.json();
            if (json.success) {
                localStorage.setItem('token', json.authToken);
                history("/");
            }
            console.log(json)
        // }
        // else {
        //     console.log("password does not match")
        //     history("/signup")
        // }
    }
    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value })
    }
    return (
        <div className='container mt-3'>
            <h1>Please fill the details to Sign up to Notebook</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" value={creds.name} onChange={onChange} id="name" name="name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={creds.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                    <div id="email" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={
                        creds.password} onChange={onChange} id="password" name="password" required minLength={5} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label"> Confirm Password</label>
                    <input type="password" className="form-control" value={
                        creds.cpassword} onChange={onChange} id="cpassword" name="cpassword" required minLength={5} />
                </div>

                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Signup
