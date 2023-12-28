import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// ovi pathovi ce trebati da se stave u poseban enum
interface navLink {
    title: string
    link: string
}

const navLinks: Array<navLink> = [
    { title: "Početna", link: "/" },
    { title: "Najduža reč", link: "/longestword" },
    { title: "Moj broj", link: "/mynumber" }
]

const Navbar = () => {
    const navigate = useNavigate()
    const [selectedLink, setSelectedLink] = useState("")

    useEffect(() => {
        setSelectedLink(window.location.pathname)
    }, [])

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Stack direction="row">
                        {
                            navLinks.map(({ title, link }, index) => {
                                return (
                                    <Button
                                        color="inherit"
                                        key={index}
                                        onClick={() => {
                                            navigate(link)
                                            setSelectedLink(link)
                                        }}
                                        className={`${selectedLink === link ? "is-active" : "is-inactive"}`}
                                    >
                                        {title}
                                    </Button>
                                )
                            })
                        }
                    </Stack>
                </Toolbar>
            </AppBar>

            <Outlet />
        </>
    )
}

export default Navbar