import { useState } from 'react'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import appLogo from './../assets/virusLogo.svg'
import './navbar.css'

{/*This creates the navbar at the top of the page*/ }

const Navbar = () => {
	const [showNavbar, setShowNavbar] = useState(false)
	const [username, setUsername] = useState('')

	const handleShowNavbar = () => {
		setShowNavbar(!showNavbar)
	}

	useEffect(() => {
		const storedUsername = sessionStorage.getItem('username');
		if (storedUsername) {
			setUsername(storedUsername);
		}
	}, []);

	return (
		<nav className="navbar">
			<div className="container">
				<div><a href={`/appointment`}><img src={appLogo} className="logo" alt="VV Logo" /> </a></div>
				<div className={`nav-elements  ${showNavbar && 'active'}`}>
					<ul>
						<li> <a href={`/appointment`}>Create Appointment</a> </li>
						<li> <a href={`/appointments`}>View Appointments</a> </li>
						<li> <a href={`/visitor`}>Manage Visitors</a> </li>
						<li> <a href={`/conditions`}>Manage Conditions</a> </li>
						<li> <a href={`/location`}>Manage Locations</a> </li>
						{username ? (
							<li>Logged in as: {username} </li>
						) : (
							<li> <a href={`/signup`}>Sign Up</a> </li>

						)}

						{username ? (
							<li> <a href={`/logout`}>Log Out</a> </li>
						) : (
							<li> <a href={`/login`}>Login</a> </li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}
export default Navbar;