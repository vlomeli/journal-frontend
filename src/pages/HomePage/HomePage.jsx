import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeJwt } from '../../ApiServices/JwtService';
import { createEntry, deleteEntry, getUserEntries, updateEntry, getUsername } from '../../ApiServices/JournalService';
import Navbar from '../../components/Navbar/Navbar';
import Cal from '../../components/Calendar/Calendar';
import './HomePage.css';


const HomePage = () => {
     // State variables
    const [newTitleValue, setNewTitleValue] = useState('');
    const [newContentValue, setNewContentValue] = useState('');
    const [newMoodValue, setNewMoodValue] = useState('');
    const [editEntryId, setEditEntryId] = useState(null);
    const [entries, setEntries] = useState([]);
    const [expandedEntries, setExpandedEntries] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const entriesPerPage =  7;
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [username, setUsername] = useState('');
    const [selectedMoodTag, setSelectedMoodTag] = useState(null);
    const [editingTitleValue, setEditingTitleValue] = useState('');
    const [editingContentValue, setEditingContentValue] = useState('');
    const [editingMoodValue, setEditingMoodValue] = useState('');

     // Navigate hook
    const navigate = useNavigate();

    // Function to log out
    const LogOut = () => {
        removeJwt();
        navigate('/');
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    // Function to calculate page number
    const calculatePageNumber = (entryIndex) => {
        return Math.ceil((entryIndex +  1) / entriesPerPage);
    };
    
    // Fetch username on component mount
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const { username } = await getUsername();
                setUsername(username);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();
    }, []); 

     // Fetch entries on currentPage change
    useEffect(() => {
        fetchEntries();
    }, [currentPage]); 

    // Log totalEntries on change
    useEffect(() => {
        console.log(`Total Entries: ${totalEntries}`);
    }, [totalEntries]);

    // Log expandedEntries on change
    useEffect(() => {
        console.log('Expanded entries:', expandedEntries);
    }, [expandedEntries]);

 
    // Function to fetch entries
    const fetchEntries = async () => {
        try {
            const fetchedEntries = await getUserEntries(currentPage);
            console.log('fetchedEntries', fetchedEntries);
            if (fetchedEntries && fetchedEntries.entries) {
                setEntries(fetchedEntries.entries);
                
                setTotalEntries(fetchedEntries.entries.length);
            } else {
                console.error('Unexpected fetchedEntries structure:', fetchedEntries);
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    }

    // Function to handle creating an entry
    const handleCreateEntry = async () => {
        console.log({
            newTitleValue,
            newContentValue,
            newMoodValue
        });
        try{
            await createEntry({
                newTitleValue,
                newContentValue,
                newMoodValue
            });
            
            setNewTitleValue('');
            setNewContentValue('');
            setNewMoodValue('');
            setEditEntryId(null);
            setSelectedMoodTag(null); 
            
            fetchEntries();
        } catch (error) {
            console.error('Error creating entry:', error);
        }
    }

    // Function to handle deleting an entry
    const handleDeleteEntry = async (entryId) => {
        await deleteEntry(entryId);
        fetchEntries();
    }

    // Function to handle editing an entry
    const handleEditEntry = (entryId) => {
        const entryToEdit = entries.find(entry => entry.EntryID === entryId);
        setEditingTitleValue(entryToEdit.Title);
        setEditingContentValue(entryToEdit.Content);
        setEditingMoodValue(entryToEdit.Mood);
        setEditEntryId(entryId);
    }

    // Function to handle saving an entry
    const handleSaveEntry = async (entryId) => {
        try {
            await updateEntry({
                id: entryId,
                title: editingTitleValue,
                content: editingContentValue,
                mood: editingMoodValue
            });
            setEditEntryId(null);
            fetchEntries();
        } catch (error) {
            console.error('Error updating entry:', error);
        }
    }

    // Function to expand an entry
    const handleExpandEntry = (entryId) => {
        console.log('Expanding entry:', entryId);
        
        setExpandedEntries(prevState => {
            
            const newState = Object.keys(prevState).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});
            
            newState[entryId] = true;
            return newState;
        });
        
    };

    // Function to handle search change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setFilteredEntries([]); 
        if (event.target.value) {
            const searchResults = entries.filter(entry =>
                entry.Title.toLowerCase().includes(event.target.value.toLowerCase()) ||
                entry.Content.toLowerCase().includes(event.target.value.toLowerCase())
            );
            setFilteredEntries(searchResults);
        }
    };

    // Function to handle suggestion click
    const handleSuggestionClick = (entryId) => {
        console.log('Suggestion clicked:', entryId);
        const entryIndex = entries.findIndex(entry => entry.EntryID === entryId);
        const pageNumber = calculatePageNumber(entryIndex);
        setCurrentPage(pageNumber);
        setExpandedEntries({ [entryId]: true });
        setFilteredEntries([]); 
        setSearchQuery(''); // Clear the search bar text
    };

    // Function to handle date click
    const handleDateClick = async (selectedDate) => {
        
        const formattedDate = selectedDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(',')[0];
        
        const entryForDate = entries.find(entry => {
           
            const entryDate = new Date(entry.DateCreated).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }).split(',')[0];
            return entryDate === formattedDate;
        });
        
        if (entryForDate) {
            const pageNumber = calculatePageNumber(entries.indexOf(entryForDate));
            setCurrentPage(pageNumber);
            setExpandedEntries({});
            setExpandedEntries(prevState => ({ ...prevState, [entryForDate.EntryID]: true }));
        } else {
            
            console.log('No entry found for the selected date');
        }
    };

    // Function to render entries list
    const renderEntriesList = () => {
        const startIndex = (currentPage -  1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const currentPageEntries = entries.slice(startIndex, endIndex);
       
   
        return currentPageEntries.map((entry) => {
            if (!entry) {
                return null;
            }
            const isEditing = entry.EntryID === editEntryId;
            const isExpanded = expandedEntries[entry.EntryID] || false;
   
            return (
                <div key={entry.EntryID} className='entry'>
                    <p onClick={() => handleExpandEntry(entry.EntryID)}>
                        Date: {new Date(entry.DateCreated).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit' })} {' '}
                        {new Date(entry.DateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p onClick={() => handleExpandEntry(entry.EntryID)}>
                        Title: {isEditing ? <span contentEditable='true' onBlur={(e) => setEditingTitleValue(e.target.textContent)}>{editingTitleValue}</span> : entry.Title}
                    </p>
                    {isExpanded && ( 
                        <>
                            <p>Content: {isEditing ? <span contentEditable='true' onBlur={(e) => setEditingContentValue(e.target.textContent)}>{editingContentValue}</span> : entry.Content}</p>
                            <p>Mood: {isEditing ? <span contentEditable='true' onBlur={(e) => setEditingMoodValue(e.target.textContent)}>{editingMoodValue}</span> : entry.Mood}</p>
                            <div className="right-column buttons-container">
                            {isEditing && (
                                <button className="delete-btn" onClick={() => handleDeleteEntry(entry.EntryID)}>X</button>
                            )}
                            {isEditing ? (
                                <>
                                    <button className="small-btn" onClick={() =>
                                    handleSaveEntry(entry.EntryID)}>Save</button>
                                    <button className="small-btn" onClick={() => {
                                        setEditingTitleValue(entry.Title);
                                        setEditingContentValue(entry.Content);
                                        setEditingMoodValue(entry.Mood);
                                        setEditEntryId(null);
                                    }}>Cancel</button>
                                </>
                            ) : (
                                <button className="small-btn" onClick={() => handleEditEntry(entry.EntryID)}>Edit</button>
                            )}
                            </div>
                        </>
                    )}
                </div>
            );
        });
    };

    return (
        <div className='home-page-container'>
            <div className='navbar-container'>
                <Navbar
                 searchQuery={searchQuery}  
                 handleSearchChange={handleSearchChange}  
                 filteredEntries={filteredEntries}
                 handleSuggestionClick={handleSuggestionClick}
                 username={username} 
                />
            </div>
            <div className='left-column'>
                <div className='inputs-container'>
                    <label htmlFor='new-entry-title-input'>TITLE:</label>
                    <input 
                        value={newTitleValue}
                        onChange={(event) => setNewTitleValue(event.target.value)}
                        id='new-entry-title-input' 
                        type='text' 
                        />
                    <label htmlFor='new-entry-content-input'>CONTENT:</label>
                    <input 
                        value={newContentValue}
                        onChange={(event) => setNewContentValue(event.target.value)} 
                        id='new-entry-content-input' 
                        type='text' 
                        />
                    <label htmlFor='new-entry-mood-input'>MOOD:</label>
                    {/* Mood tags */}
                <div className="mood-tags-container">
                    <button onClick={() => {
                        setNewMoodValue('Sad');
                        setSelectedMoodTag('Sad');
                    }} className={`mood-tag ${selectedMoodTag === 'Sad' ? 'selected' : ''}`}>Sad</button>
                    <button onClick={() => {
                        setNewMoodValue('Neutral');
                        setSelectedMoodTag('Neutral');
                    }} className={`mood-tag ${selectedMoodTag === 'Neutral' ? 'selected' : ''}`}>Neutral</button>
                    <button onClick={() => {
                        setNewMoodValue('Happy');
                        setSelectedMoodTag('Happy');
                    }} className={`mood-tag ${selectedMoodTag === 'Happy' ? 'selected' : ''}`}>Happy</button>
                </div>
                <button onClick={handleCreateEntry} className='blue-btn new-entry-btn'> NEW ENTRY </button>
            </div>
                <div className='calendar-container'>
                     <Cal 
                    onDateClick={handleDateClick} 
                    entries={entries}
                     />
                </div>
                <div className='logout-button-container'>
                    <button className='blue-btn logout-btn' onClick={LogOut}>LOG OUT</button>
                </div>
            </div>
            <div className='right-column'>
                <div className='entries-container'>
                    <h1> All ENTRIES</h1>
                    {renderEntriesList()}
                    <div className="pages-container">
                    <button className='pages-btn' onClick={() => setCurrentPage(currentPage -   1)} disabled={currentPage ===   1}>←</button>
                    <button className='pages-btn' onClick={() => setCurrentPage(currentPage +   1)} disabled={currentPage === totalPages}>→</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default HomePage; 