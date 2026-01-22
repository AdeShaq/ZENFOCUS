import React, { useEffect } from 'react';

// Using a simple beep sound for alarms as a default
const ALARM_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'; // Bell Notification

export const NotificationManager: React.FC = () => {
    useEffect(() => {
        // Request notification permission on mount
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Expose a global function to trigger alarms from other parts of the app
    // This is a simple event bus mechanism attached to window
    useEffect(() => {
        const handleTriggerAlarm = (e: CustomEvent<{ title: string; body: string }>) => {
            playAlarmSound();
            showNotification(e.detail.title, e.detail.body);
        };

        window.addEventListener('trigger-alarm', handleTriggerAlarm as EventListener);
        return () => {
            window.removeEventListener('trigger-alarm', handleTriggerAlarm as EventListener);
        };
    }, []);

    const playAlarmSound = () => {
        try {
            const audio = new Audio(ALARM_SOUND_URL);
            audio.volume = 1.0;
            audio.loop = true;

            // Play for 20 seconds then stop
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setTimeout(() => {
                        audio.pause();
                        audio.currentTime = 0;
                    }, 20000);
                }).catch(err => {
                    console.warn('Audio playback failed (likely user interaction required):', err);
                });
            }
        } catch (e) {
            console.error('Error playing audio:', e);
        }
    };

    const showNotification = (title: string, body: string) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            // Local notification
            const options: any = {
                body,
                icon: '/icon.svg',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                requireInteraction: true
            };
            new Notification(title, options);
        }
    };

    return null; // Logic-only component
};

declare global {
    interface WindowEventMap {
        'trigger-alarm': CustomEvent<{ title: string; body: string }>;
    }
}

export const triggerAlarm = (title: string, body: string) => {
    window.dispatchEvent(new CustomEvent('trigger-alarm', { detail: { title, body } }));
};
