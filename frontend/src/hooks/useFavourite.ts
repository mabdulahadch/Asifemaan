import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    addFavContent,
    removeFavContent,
    getFavContentIds,
    followPoet,
    unfollowPoet,
    getFollowedPoetIds,
} from "@/lib/api/favourites";

/**
 * Hook for managing content favourites with auth check.
 * If user is not logged in, clicking favourite redirects to login.
 */
export const useFavouriteContent = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [favIds, setFavIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    // Fetch user's favourite content IDs on mount (if logged in)
    useEffect(() => {
        if (!isLoggedIn) {
            setFavIds(new Set());
            return;
        }
        setLoading(true);
        getFavContentIds()
            .then((ids) => setFavIds(new Set(ids)))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [isLoggedIn]);

    const toggleFav = useCallback(
        async (contentId: number) => {
            if (!isLoggedIn) {
                navigate("/login", { state: { from: location.pathname } });
                return;
            }

            const isFav = favIds.has(contentId);
            // Optimistic update
            setFavIds((prev) => {
                const next = new Set(prev);
                isFav ? next.delete(contentId) : next.add(contentId);
                return next;
            });

            try {
                if (isFav) {
                    await removeFavContent(contentId);
                } else {
                    await addFavContent(contentId);
                }
            } catch {
                // Revert on error
                setFavIds((prev) => {
                    const next = new Set(prev);
                    isFav ? next.add(contentId) : next.delete(contentId);
                    return next;
                });
            }
        },
        [isLoggedIn, favIds, navigate, location.pathname]
    );

    return { favIds, toggleFav, loading };
};

/**
 * Hook for managing poet follows with auth check.
 */
export const useFollowPoet = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            setFollowedIds(new Set());
            return;
        }
        setLoading(true);
        getFollowedPoetIds()
            .then((ids) => setFollowedIds(new Set(ids)))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [isLoggedIn]);

    const toggleFollow = useCallback(
        async (poetId: number) => {
            if (!isLoggedIn) {
                navigate("/login", { state: { from: location.pathname } });
                return;
            }

            const isFollowed = followedIds.has(poetId);
            setFollowedIds((prev) => {
                const next = new Set(prev);
                isFollowed ? next.delete(poetId) : next.add(poetId);
                return next;
            });

            try {
                if (isFollowed) {
                    await unfollowPoet(poetId);
                } else {
                    await followPoet(poetId);
                }
            } catch {
                setFollowedIds((prev) => {
                    const next = new Set(prev);
                    isFollowed ? next.add(poetId) : next.delete(poetId);
                    return next;
                });
            }
        },
        [isLoggedIn, followedIds, navigate, location.pathname]
    );

    return { followedIds, toggleFollow, loading };
};
