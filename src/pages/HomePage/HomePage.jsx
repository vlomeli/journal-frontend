import { useState, useEffect} from 'react';
import { removeJwt } from '../../ApiServices/JwtService';
import { useNavigate} from 'react-router-dom';
import { createEntry, deleteEntry, getUserEntries, updateEntry } from '../../ApiServices/JournalService';
import Navbar from '../../components/Navbar/Navbar';
import Cal from '../../components/Calendar/Calendar';
import './HomePage.css';

const HomePage = () => {
    const [newTitleValue, setNewTitleValue] = useState('');
    const [newContentValue, setNewContentValue] = useState('');
    const [newMoodValue, setNewMoodValue] = useState('');
    const [editEntryId, setEditEntryId] = useState(null);
    const [ entries, setEntries ] = useState ([]);

// allows you to render entries when you open home page
    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const fetchedEntries = await getUserEntries();
            console.log('entries, fetchedEntries', fetchedEntries);
            setEntries(fetchedEntries.entries);
        } catch (error) {
            console.log('Error fetching entries', error);
        }
    }

// allows to create a new entry
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
        // rerenders when submitted
        fetchEntries();
    }
    
    const handleDeleteEntry = async (entryId) => {
        await deleteEntry(entryId);
        fetchEntries();
    }

    const handleEditEntry = (entryId) => {
            // Find the entry to edit by its ID
    const entryToEdit = entries.find(entry => entry.EntryID === entryId);
    
    // Update the state with the entry data
    setNewTitleValue(entryToEdit.Title);
    setNewContentValue(entryToEdit.Content);
    setNewMoodValue(entryToEdit.Mood);

    // Set the entry ID to indicate that editing is in progress
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
    }catch (error) {
        console.error('Error updating entry:', error);
    }
    }

    const renderEntriesList = () => {
        if (!Array.isArray(entries)) {
            console.log('Entries is not an array');
            return <p> No entries to display</p>;
        }
    
        return entries.map((entry) => {
            if (!entry) {
                return null; // Skip rendering if entry is null or undefined
            }
            if (entry.EntryID === editEntryId) {
                return (
                    <div key={entry.EntryID}>
                        <input type="text" value={newTitleValue} onChange={(e) => setNewTitleValue(e.target.value)} />
                        <input type="text" value={newContentValue} onChange={(e) => setNewContentValue(e.target.value)} />
                        <input type="text" value={newMoodValue} onChange={(e) => setNewMoodValue(e.target.value)} />
                        <button onClick={() => handleSaveEntry(entry.EntryID, { title: newTitleValue, content: newContentValue, mood: newMoodValue })}>Save</button>
                        <button onClick={() => {
                        setNewTitleValue(entry.Title);
                        setNewContentValue(entry.Content);
                        setNewMoodValue(entry.Mood);
                        setEditEntryId(null);
                    }}>Cancel</button>
                    </div>
                );
            } else {
                return (
                    <div key={entry.EntryID}>
                        <p>Date: {new Date(entry.DateCreated).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit' })} {' '}
                            {new Date(entry.DateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p> Title: {entry.Title}</p>
                        <p> Content: {entry.Content}</p>
                        <p> Mood: {entry.Mood}</p>
                        <button onClick={() => handleDeleteEntry(entry.EntryID)}> Delete </button>
                        <button onClick={() => handleEditEntry(entry.EntryID)}> Edit</button>
                    </div>
                );
            }
        });
    };

// takes you to login page when you click
    const navigate = useNavigate()

    const LogOut = () => {
        removeJwt();
        navigate('/')
    }

// all that is rendered on the page
    return (
        <div className='home-page-container'>
        <div className='navbar-container'>
          <Navbar />
        </div>
    
        <div className="content-container">
          <div className='inputs-container'>
            <label htmlFor='new-entry-title-input'>Title:</label>
            <input onChange={(event) => setNewTitleValue(event.target.value)} id='new-entry-title-input' type='text' />
    
            <label htmlFor='new-entry-content-input'>Content:</label>
            <input onChange={(event) => setNewContentValue(event.target.value)} id='new-entry-content-input' type='text' />
    
            <label htmlFor='new-entry-mood-input'>Mood:</label>
            <input onChange={(event) => setNewMoodValue(event.target.value)} id='new-entry-mood-input' type='text' />
            
            <button onClick={handleCreateEntry} className='blue-btn new-entry-btn'> New Entry </button>
          </div>
            
        
          <div className='entries-container'>
            <h1> All ENTRIES</h1>
            {renderEntriesList()}
          </div>
        </div>
    
            <div>
             <Cal/>
            </div>

        <div className='logout-button-container'>
          <button className=' blue-btn logout-btn' onClick={LogOut}>LOG OUT</button>
        </div>
      </div>

    );
}

export default HomePage;