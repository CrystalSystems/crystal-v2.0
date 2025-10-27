// frontend/src/shared/hooks/useWebSocket.js

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthData } from '../../../features';
import { WS_URL } from '../../../shared/constants';

export function useWebSocket() {
  const queryClient = useQueryClient();
  const { authorizedUser, isSuccess: isAuthSuccess } = useAuthData();
  const wsRef = useRef(null);
  const tabId = useRef(crypto.randomUUID());
  const [wsState, setWsState] = useState({
    isConnected: false,
    isPending: false,
    isError: false,
    isSuccess: false,
  });

  useEffect(() => {
    // console.log('useWebSocket: Effect worked', { isAuthSuccess, authorizedUser });

    // When !isAuthSuccess closes the WebSocket immediately
    if (!isAuthSuccess) {
      // console.log('useWebSocket: isAuthSuccess false, close WebSocket');
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        // console.log('useWebSocket: Send logout message and close');
        wsRef.current.send(
          JSON.stringify({
            type: 'logout',
            userId: authorizedUser?._id || 'unknown',
            tabId: tabId.current,
          })
        );
        wsRef.current.close(1000, 'User has logged out');
      }
      if (wsRef.current?.activityInterval) {
        // console.log('useWebSocket: Clearing activity interval');
        clearInterval(wsRef.current.activityInterval);
      }
      setWsState({
        isConnected: false,
        isPending: false,
        isError: false,
        isSuccess: false,
      });
      wsRef.current = null;
      return;
    }

    if (!authorizedUser?._id) {
      // console.log('useWebSocket: No _id of the authorized user, skip WebSocket');
      setWsState({
        isConnected: false,
        isPending: false,
        isError: false,
        isSuccess: false,
      });
      return;
    }

    const userId = authorizedUser._id;
    // console.log(`useWebSocket: Connect for userId ${userId}, tabId ${tabId.current} to ${WS_URL}`);
    setWsState((prev) => ({ ...prev, isPending: true, isError: false, isSuccess: false }));

    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onopen = () => {
      // console.log('useWebSocket: WebSocket connected');
      setWsState({ isConnected: true, isPending: false, isError: false, isSuccess: true });
      wsRef.current.send(
        JSON.stringify({
          type: 'visibility',
          status: document.visibilityState,
          userId,
          tabId: tabId.current,
        })
      );

      const activityInterval = setInterval(() => {
        if (wsRef.current.readyState === WebSocket.OPEN && isAuthSuccess) {
          // console.log(`useWebSocket: Send activity for userId ${userId}, tabId ${tabId.current}`);
          wsRef.current.send(JSON.stringify({ type: 'activity', userId, tabId: tabId.current }));
          // console.log('useWebSocket: Sending a ping to the server');
          wsRef.current.send('ping');
        } else if (!isAuthSuccess) {
          // console.log('useWebSocket: Stop activity, user is not authorized');
          clearInterval(wsRef.current.activityInterval);
          wsRef.current.close(1000, 'User has logged out');
        }
      }, 30000); // speed adjustment isOnline: false, when leaving or minimizing a tab
      wsRef.current.activityInterval = activityInterval;
    };

    wsRef.current.onmessage = (event) => {
      try {
        if (event.data === 'pong') {
          // console.log('useWebSocket: Received pong from server');
          return;
        }
        const data = JSON.parse(event.data);
        // console.log('useWebSocket: Message received:', data);
        if (data.type === 'user:online' || data.type === 'user:offline') {
          // console.log('useWebSocket: Resetting cache ["users"] for user:online/offline', { userId: data.userId });
          queryClient.invalidateQueries({ queryKey: ['users'] });
        }
      } catch (error) {
        console.error('useWebSocket: Error parsing message:', error);
        setWsState((prev) => ({ ...prev, isError: true }));
      }
    };

    wsRef.current.onclose = (event) => {
      // console.log('useWebSocket: WebSocket disabled', { code: event.code, reason: event.reason });
      setWsState({ isConnected: false, isPending: false, isError: true, isSuccess: false });
      if (wsRef.current?.activityInterval) {
        // console.log('useWebSocket: Clearing activity interval');
        clearInterval(wsRef.current.activityInterval);
      }
      setTimeout(() => {
        if (!isAuthSuccess) {
          // console.log('useWebSocket: Skip reconnection attempt: user is not authorized');
          return;
        }
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          // console.log('useWebSocket: Trying to reconnect');
          queryClient.invalidateQueries({ queryKey: ['users'] });
          wsRef.current = new WebSocket(WS_URL);
          setWsState((prev) => ({ ...prev, isPending: true }));
        }
      }, 1000);
    };

    wsRef.current.onerror = (error) => {
      console.error('useWebSocket: WebSocket Error:', error);
      setWsState({ isConnected: false, isPending: false, isError: true, isSuccess: false });
      // console.log('useWebSocket: Reset cache ["users"] on error');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (wsRef.current) {
        wsRef.current.close();
      }
    };

    const handleVisibilityChange = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN && isAuthSuccess) {
        const status = document.visibilityState;
        // console.log(`useWebSocket: Visibility changed to ${status} for userId ${userId}, tabId ${tabId.current}`);
        wsRef.current.send(
          JSON.stringify({ type: 'visibility', status, userId, tabId: tabId.current })
        );
      }
    };

    // Periodic isAuthSuccess check for other tabs
    const authCheckInterval = setInterval(() => {
      if (!isAuthSuccess && wsRef.current?.readyState === WebSocket.OPEN) {
        // console.log('useWebSocket: User is not authorized, close WebSocket');
        wsRef.current.send(
          JSON.stringify({
            type: 'logout',
            userId: authorizedUser?._id || 'unknown',
            tabId: tabId.current,
          })
        );
        wsRef.current.close(1000, 'User has logged out');
      }
    }, 5000); // Check every 5 seconds

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // console.log('useWebSocket: Clear WebSocket', { isAuthSuccess });
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          // console.log('useWebSocket: Send logout message and close on cleanup');
          wsRef.current.send(
            JSON.stringify({
              type: 'logout',
              userId: authorizedUser?._id || 'unknown',
              tabId: tabId.current,
            })
          );
          wsRef.current.close(1000, 'User logged out or clearing');
        }
        if (wsRef.current.activityInterval) {
          // console.log('useWebSocket: Clear activity interval when clearing');
          clearInterval(wsRef.current.activityInterval);
        }
        wsRef.current = null;
      }
      clearInterval(authCheckInterval); // Clearing the check interval
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      setWsState({ isConnected: false, isPending: false, isError: false, isSuccess: false });
    };
  }, [queryClient, isAuthSuccess, authorizedUser?._id]);

  return {
    isConnected: wsState.isConnected,
    isPending: wsState.isPending,
    isError: wsState.isError,
    isSuccess: wsState.isSuccess,
  };
}