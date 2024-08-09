import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Navbar from './Navbar';
import TeamCard from '../cards/TeamCard';

const SubscribedTeams: React.FC = () => {
    const subscriptions = useSelector((state: RootState) => state.subscriptions.subscribedTeams);

    return (
        <div className="mx-auto mt-5">
            <Navbar />
            <div>
                <h2 className="flex justify-center text-2xl font-bold">Subscribed NBA Teams</h2>
                <div className="flex flex-wrap justify-center gap-4 p-4">
                    {subscriptions.map((team, index) => (
                        <div key={index} className='flex-none'>
                            <TeamCard teamName={team} subscriptions={subscriptions} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscribedTeams;
