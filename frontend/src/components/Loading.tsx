import React from 'react';
import Logo from '../assets/icons/basketball-ball.svg';

const Loading: React.FC = () => {


    return (
        <>
            <div className="p-4 bg-gray-200 rounded-2xl">
                <div className="max-w-7xl mx-auto flex items-center justify-center">
                    <div className='flex items-center'>
                        <img src={Logo.toString()} alt="NBA Logo" className="w-8 h-8 mr-2" />
                        <span className="text-gray-900 text-3xl font-semibold">NBA Notifier</span>
                    </div>
                </div>
            </div>
            <span className='flex items-center justify-center'>Loading...</span>
        </>
    );
}

export default Loading;
