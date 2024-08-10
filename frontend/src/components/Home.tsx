import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import Navbar from './Navbar';
import TeamCard from '../cards/TeamCard';

const teams = ['76ers', 'Blazers', 'Bucks', 'Bulls', 'Cavaliers', 'Celtics', 'Clippers', 'Grizzlies',
    'Hawks', 'Heat', 'Hornets', 'Jazz', 'Kings', 'Knicks', 'Lakers', 'Magic', 'Mavericks', 'Nets',
    'Nuggets', 'Pacers', 'Pelicans', 'Pistons', 'Raptors', 'Rockets', 'Spurs', 'Suns', 'Thunder',
    'Timberwolves', 'Warriors', 'Wizards'];

const Home: React.FC = () => {
    const subscriptions = useSelector((state: RootState) => state.subscriptions.subscribedTeams);

    return (
        <div className="mx-auto mt-5">
            <Navbar />
            <div className='flex items-center justify-center my-8'>
                <span className="text-gray-900 text-3xl font-semibold">Subscribe to NBA Teams</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 p-4">
                {teams.map((team, index) => (
                    <div key={index} className='flex-none'>
                        <TeamCard teamName={team} subscriptions={subscriptions} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
