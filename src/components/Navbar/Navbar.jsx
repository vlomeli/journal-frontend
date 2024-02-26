import './Navbar.css';
import searchIcon from '../../images/search-icon.png';


const Navbar = ({ searchQuery, handleSearchChange, filteredEntries, handleSuggestionClick, username }) => {
    return (
        <nav id='header'>
            <div className='navbar-container'>
                <h1> WELCOME {username} ツ</h1>
                <div className='search-container'>
                    <input  
                        type='text'
                        id='search-bar'  
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <img src={searchIcon} alt='Search' id='search-icon' />
                    {searchQuery && (
                        <div className='suggestions-container'>
                            {filteredEntries.map(entry => (
                                <div 
                                key={entry.EntryID} 
                                className='search-suggestion' 
                                onClick={() => handleSuggestionClick(entry.EntryID)}>
                                    {entry.Title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};


export default Navbar;
