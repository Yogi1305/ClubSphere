import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Baseurl } from '../../main';

const Clubdetails = ({ club }) => {
    const [clubDetails, setClubDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch club details from an API or other source
        fetchClubDetails();
    }, []);
    const fetchClubDetails = async () => {
        try {
            const response = await axios.get(`${Baseurl}/member/postholders/${club}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Club details response:', response.data.data);
            setClubDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching club details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
           
            {clubDetails.length === 0 ? (
                <p>No post holders found.</p>
            ) : (
                <ul>
                    {clubDetails.map((holder) => (
                        <li key={holder.id}>
                            <h3>{holder.UserId.fullName}</h3>
                            <h3>{holder.Role}</h3>
                           
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Clubdetails;
