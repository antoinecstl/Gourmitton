"use client";

import { useState, useEffect, useRef } from "react";
import { RecipeFormProps } from "../types/Recipe";
import Link from "next/link";

interface LikeButtonProps {
  recipeId: string;
}

class CustomEventSource {
  private url: string;
  private headers: HeadersInit;
  private abortController: AbortController | null = null;
  private listeners: Record<string, ((event: unknown) => void)[]> = {};
  private isConnected: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private retryTimeout: NodeJS.Timeout | null = null;
  private intentionalClose: boolean = false;

  constructor(url: string, headers: HeadersInit = {}) {
    this.url = url;
    this.headers = headers;
  }

  // Add an event listener
  addEventListener(eventType: string, callback: (event: unknown) => void) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  // Connect to the SSE endpoint
  connect() {
    // Don't reconnect if intentionally closed
    if (this.intentionalClose) {
      return;
    }
    
    // Clear any existing retry timeout
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    // Create a new abort controller for this request
    this.abortController = new AbortController();
    
    // Start the fetch request with proper headers for SSE
    fetch(this.url, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        ...this.headers
      },
      signal: this.abortController.signal
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.body) {
        throw new Error("Response body is null");
      }

      this.isConnected = true;
      this.retryCount = 0;
      
      // Get a reader from the response body
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Process the incoming data stream
      const processStream = ({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
        // Check if we're intentionally closed
        if (this.intentionalClose) {
          return Promise.resolve();
        }
        
        if (done) {
          if (!this.intentionalClose) {
            console.log("Stream complete");
            this.reconnect();
          }
          return Promise.resolve();
        }

        // Decode the incoming chunk and add it to our buffer
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Process complete events in the buffer
        const events = buffer.split("\n\n");
        buffer = events.pop() || ''; // Keep the last incomplete event in the buffer
        
        // Process each complete event
        events.forEach(eventStr => {
          if (!eventStr.trim()) return;
          
          const eventLines = eventStr.split('\n');
          let eventType = 'message';
          let data = '';
          
          eventLines.forEach(line => {
            if (line.startsWith('event:')) {
              eventType = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              data = line.slice(5).trim();
            }
          });
          
          // Dispatch the event to listeners
          if (this.listeners[eventType]) {
            const event = { data };
            this.listeners[eventType].forEach(callback => callback(event));
          }
        });
        
        // Continue reading from the stream if we're still active
        if (!this.intentionalClose && this.abortController) {
          return reader.read().then(processStream).catch(error => {
            if (!this.intentionalClose) {
              this.handleError(error);
            }
            return Promise.resolve();
          });
        }
        
        return Promise.resolve();
      };

      // Start reading from the stream
      return reader.read()
        .then(processStream)
        .catch(error => {
          if (!this.intentionalClose) {
            this.handleError(error);
          }
        });
    })
    .catch(error => {
      // Don't log aborted requests as errors when intentionally closed
      if (error.name === 'AbortError' && this.intentionalClose) {
        console.log("SSE connection closed intentionally");
      } else if (!this.intentionalClose) {
        this.handleError(error);
      }
    });
  }
  
  // Handle errors with proper logging and reconnection
  private handleError(error: Error) {
    // Only log non-abort errors or when not intentionally closed
    if (!(error.name === 'AbortError' && this.intentionalClose)) {
      console.error("SSE connection error:", error);
    }
    
    this.isConnected = false;
    
    // Only reconnect if not intentionally closed
    if (!this.intentionalClose) {
      this.reconnect();
    }
  }

  // Try to reconnect with exponential backoff
  private reconnect() {
    if (this.intentionalClose) return;
    
    if (this.retryCount < this.maxRetries) {
      const timeout = Math.min(1000 * 2 ** this.retryCount, 10000);
      this.retryCount++;
      console.log(`Attempting to reconnect (${this.retryCount}/${this.maxRetries}) in ${timeout}ms...`);
      
      this.retryTimeout = setTimeout(() => {
        if (!this.intentionalClose) {
          this.connect();
        }
      }, timeout);
    } else {
      console.error("Maximum SSE reconnection attempts reached");
    }
  }

  // Close the connection
  close() {
    this.intentionalClose = true;
    
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    
    this.isConnected = false;
  }
}

export default function LikeButton({ recipeId }: LikeButtonProps) {
  const [isLogged, setIsLogged] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(-1);
  const eventSourceRef = useRef<CustomEventSource | null>(null);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    if (localStorage.getItem('jwt_token')) {
      setIsLogged(true);
  }

    
    // Set mount status
    mountedRef.current = true;
    
    // Create our custom SSE client with proper headers
    const eventSource = new CustomEventSource(
      `https://gourmet.cours.quimerch.com/recipes/${recipeId}/stars`,
      {
        'Accept': 'application/json, application/xml, text/event-stream',
      }
    );
    
    // Store the reference
    eventSourceRef.current = eventSource;
    
    // Listen for count events
    eventSource.addEventListener('count', (event: unknown) => {
      try {
        if (mountedRef.current) {
          const eventData = event as { data: string };
          const count = parseInt(eventData.data, 10);
          if (!isNaN(count)) {
            setLikeCount(count);
          }
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    });
    
    // Connect to the SSE endpoint
    eventSource.connect();

    // Fetch the favorites recipe to find if the heart should be filled or not
    async function fetchFavorites() {
      try {
        const res = await fetch(`https://gourmet.cours.quimerch.com/favorites`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
          },
          credentials: 'include' as RequestCredentials
        });

        if (res.ok) {
          const data = await res.json();
          const favorites = data.map((recipe: RecipeFormProps) => recipe.recipe.id);
          setIsLiked(favorites.includes(recipeId));

        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    }
    fetchFavorites();

    // Clean up on unmount
    return () => {
      mountedRef.current = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [recipeId]);
  

  async function handleLike() {
    const username = localStorage.getItem('username');
    const recipeID = recipeId;
    if (isLiked) {
      try {
        const del = await fetch(`https://gourmet.cours.quimerch.com/users/${username}/favorites?recipeID=${recipeID}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json, application/xml',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
          },
          credentials: 'include' as RequestCredentials,
        });
  
        if (del.ok) {
          const res = await del.json();
          console.log(res);
          setIsLiked(false);
        }
      } catch (err) {
        console.error('Error removing favorite:', err);
      }
    }
    else {
      try {
        const res = await fetch(`https://gourmet.cours.quimerch.com/users/${username}/favorites?recipeID=${recipeID}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json, application/xml',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
          },
          body: undefined,
          credentials: 'include' as RequestCredentials,
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setIsLiked(true);
        }
      } catch (err) {
        console.error('Error liking recipe:', err);
      } 
    }
  };

  return (
    <div className="flex items-center gap-1">
      {isLogged ? (
        <button 
        onClick={() => handleLike()}
        className="transition-transform duration-200 transform hover:scale-110 active:scale-95 focus:outline-none"
        aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
      {isLiked ? (
          // Coeur rempli (état aimé)
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className="w-7 h-7"
          >
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="#FF3B30"
              stroke="#FF3B30"
              strokeWidth="1"
            />
          </svg>
        ) : (
          // Coeur vide (état non aimé)
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className="w-7 h-7"
          >
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </button> 

      ) : 
      <Link href="/login" prefetch={false}>
        <button className="transition-transform duration-200 transform hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Se connecter pour ajouter aux favoris">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            className="w-7 h-7"
          >
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </Link>}

      
      { likeCount != -1 ? (
        <span className="text-lg text-white">{likeCount}</span>
      ) : null }
    </div>
  );
}
