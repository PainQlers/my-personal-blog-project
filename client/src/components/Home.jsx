import Navbar from "./Navbar"
import NavbarUser from "./NavbarUser"
import HeroSelection from "./HeroSelection"
import ArticleSection from "./ArticleSection"
import Footer from "./Footer"
import { useAuth } from "../context/Authentication"

function Home() {
    const { isAuthenticated } = useAuth();
    
    return(
        <>
            {isAuthenticated ? <NavbarUser /> : <Navbar />}
            <HeroSelection />
            <ArticleSection />
            <Footer /> 
        </>
    )
    
}

export default Home;