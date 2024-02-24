import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeJwt } from '../../ApiServices/JwtService';
import { createEntry, deleteEntry, getUserEntries, updateEntry } from '../../ApiServices/JournalService';
import Navbar from '../../components/Navbar/Navbar';
import Cal from '../../components/Calendar/Calendar';
import './HomePage.css';


const HomePage = () => {
    const [newTitleValue, setNewTitleValue] = useState('');
    const [newContentValue, setNewContentValue] = useState('');
    const [newMoodValue, setNewMoodValue] = useState('');
    const [editEntryId, setEditEntryId] = useState(null);
    const [entries, setEntries] = useState([]);
    const [expandedEntries, setExpandedEntries] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const entriesPerPage =  7;


    useEffect(() => {
        fetchEntries();
    }, [currentPage]); // Depend on currentPage to refetch when it changes

    useEffect(() => {
        console.log(`Total Entries: ${totalEntries}`);
    }, [totalEntries]);


    const fetchEntries = async () => {
        try {
            const fetchedEntries = await getUserEntries(currentPage);
            console.log('fetchedEntries', fetchedEntries);
            if (fetchedEntries && fetchedEntries.entries) {
                setEntries(fetchedEntries.entries);
                // Assuming fetchedEntries.entries is an array, use its length as the total entries
                setTotalEntries(fetchedEntries.entries.length);
            } else {
                console.error('Unexpected fetchedEntries structure:', fetchedEntries);
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    }


    const handleCreateEntry = async () => {
        console.log({
            newTitleValue,
            newContentValue,
            newMoodValue
        })
        await createEntry({
            newTitleValue,
            newContentValue,
            newMoodValue
        });
        fetchEntries();
    }


    const handleDeleteEntry = async (entryId) => {
        await deleteEntry(entryId);
        fetchEntries();
    }


    const handleEditEntry = (entryId) => {
        const entryToEdit = entries.find(entry => entry.EntryID === entryId);
        setNewTitleValue(entryToEdit.Title);
        setNewContentValue(entryToEdit.Content);
        setNewMoodValue(entryToEdit.Mood);
        setEditEntryId(entryId);
    }


    const handleSaveEntry = async (entryId, updatedEntryData) => {
        try {
            await updateEntry({
                id: entryId,
                title: updatedEntryData.title,
                content: updatedEntryData.content,
                mood: updatedEntryData.mood
            });
            setEditEntryId(null);
            fetchEntries();
        } catch (error) {
            console.error('Error updating entry:', error);
        }
    }


    const handleExpandEntry = (entryId) => {
         // Close all entries
    setExpandedEntries({});


    // Open the clicked entry
    setExpandedEntries(prevState => ({ ...prevState, [entryId]: true }));
    };


    const renderEntriesList = () => {
        const startIndex = (currentPage -  1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const currentPageEntries = entries.slice(startIndex, endIndex);
   
        return currentPageEntries.map((entry) => {
            if (!entry) {
                return null;
            }
            const isEditing = entry.EntryID === editEntryId;
            const isExpanded = expandedEntries[entry.EntryID] || false; // Correctly check if the entry is expanded
   
            return (
                <div key={entry.EntryID} className='entry'>
                    <p onClick={() => handleExpandEntry(entry.EntryID)}>
                        Date: {new Date(entry.DateCreated).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit' })} {' '}
                        {new Date(entry.DateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p onClick={() => handleExpandEntry(entry.EntryID)}>
                        Title: {isEditing ? <span contentEditable='true' onBlur={(e) => setNewTitleValue(e.target.textContent)}>{entry.Title}</span> : entry.Title}
                    </p>
                    {isExpanded && ( // Only render expanded content if the entry is expanded
                        <>
                            <p>Content: {isEditing ? <span contentEditable='true' onBlur={(e) => setNewContentValue(e.target.textContent)}>{entry.Content}</span> : entry.Content}</p>
                            <p>Mood: {isEditing ? <span contentEditable='true' onBlur={(e) => setNewMoodValue(e.target.textContent)}>{entry.Mood}</span> : entry.Mood}</p>
                            <div className="right-column buttons-container">
                            <button className="small-btn" onClick={() => handleDeleteEntry(entry.EntryID)}>Delete</button>
                            {isEditing ? (
                                <>
                                    <button className="small-btn" onClick={() => 
                                    handleSaveEntry(entry.EntryID, { title: newTitleValue, content: newContentValue, mood: newMoodValue })}>Save</button>
                                    <button className="small-btn" onClick={() => {
                                        setNewTitleValue(entry.Title);
                                        setNewContentValue(entry.Content);
                                        setNewMoodValue(entry.Mood);
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


    const navigate = useNavigate();


    const LogOut = () => {
        removeJwt();
        navigate('/');
    }


    const totalPages = Math.ceil(totalEntries / entriesPerPage);


    return (
        <div className='home-page-container'>
            <div className='navbar-container'>
                <Navbar />
            </div>
            <div className='left-column'>
                <div className='inputs-container'>
                    <label htmlFor='new-entry-title-input'>Title:</label>
                    <input onChange={(event) => setNewTitleValue(event.target.value)} id='new-entry-title-input' type='text' />
                    <label htmlFor='new-entry-content-input'>Content:</label>
                    <input onChange={(event) => setNewContentValue(event.target.value)} id='new-entry-content-input' type='text' />
                    <label htmlFor='new-entry-mood-input'>Mood:</label>
                    <input onChange={(event) => setNewMoodValue(event.target.value)} id='new-entry-mood-input' type='text' />
                    <button onClick={handleCreateEntry} className='blue-btn new-entry-btn'> NEW ENTRY </button>
                </div>
                <div className='calendar-container'>
                    <Cal />
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
 