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
            <h2 className="flex justify-center mx-10 text-2xl font-bold">Subscribe to NBA Teams</h2>
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
