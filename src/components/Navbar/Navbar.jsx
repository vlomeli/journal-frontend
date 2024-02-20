import './Navbar.css';
import searchIcon from '../../images/search-icon.png';

const Navbar = () => {
    return (
        <nav id='header'>
            <div className='navbar-container'>
                <h1> WELCOME USER ツ</h1>
                <div className='search-container'>
                    <input type='text' id='search-bar' placeholder='Search...' />
                    <img src={searchIcon} alt='Search' id='search-icon' />
                </div>
            </div>
        </nav>
    )
}

export default Navbar;