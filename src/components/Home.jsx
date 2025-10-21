import Navbar from "./Navbar"
import NavbarUser from "./NavbarUser"
import HeroSelection from "./HeroSelection"
import ArticleSection from "./ArticleSection"
import Footer from "./Footer"

function Home() {
    return(
        <>
            <NavbarUser />
            <HeroSelection />
            <ArticleSection />
            <Footer /> 
        </>
    )
    
}

export default Home;