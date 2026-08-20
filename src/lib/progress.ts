export function nextProgress(season:number,episode:number,episodeCount?:number,nextSeason?:number){
 if(episodeCount && episode>=episodeCount && nextSeason) return {season:nextSeason,episode:1};
 return {season,episode:episode+1};
}
export function timeAgo(value:string){const seconds=Math.max(0,Math.floor((Date.now()-new Date(value).getTime())/1000));if(seconds<60)return "just now";if(seconds<3600)return `${Math.floor(seconds/60)}m ago`;if(seconds<86400)return `${Math.floor(seconds/3600)}h ago`;const days=Math.floor(seconds/86400);return days<30?`${days}d ago`:new Date(value).toLocaleDateString();}
