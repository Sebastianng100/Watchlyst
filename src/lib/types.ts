export type MediaType = "tv" | "movie";
export type WatchStatus = "watching" | "plan_to_watch" | "completed" | "on_hold" | "dropped" | "watched";
export interface WatchItem { id:string; user_id:string; tmdb_id:number; media_type:MediaType; title:string; poster_path:string|null; overview:string|null; release_year:number|null; status:WatchStatus; current_season:number|null; current_episode:number|null; rating:number|null; notes:string|null; created_at:string; updated_at:string }
export interface TmdbResult { id:number; media_type:MediaType; title:string; poster_path:string|null; overview:string; release_year:number|null }
export const labels: Record<WatchStatus,string>={watching:"Watching",plan_to_watch:"Plan to Watch",completed:"Completed",on_hold:"On Hold",dropped:"Dropped",watched:"Watched"};
