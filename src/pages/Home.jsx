import Hero from '../components/Hero';
import Menu from '../components/Menu';
import Cinema from '../components/Cinema';
import Location from '../components/Location';
import Reviews from '../components/Reviews';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="relative z-10 w-full overflow-hidden">
            <Navbar />
            <Hero />
            <Menu />
            <Cinema />
            <Location />
            <Reviews />
            <Footer />
        </div>
    );
};

export default Home;
