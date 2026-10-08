export const access = "public";
export const methods = ["GET"];
export default async function(req,res){
 const url="https://public-api.wordpress.com/rest/v1.1/sites/wedealproperty.wordpress.com/posts/?number=100&status=publish";
 const r=await fetch(url);
 if(!r.ok)return res.status(502).json({error:"WordPress unavailable"});
 const data=await r.json();
 const posts=data.posts||[];
 const out=posts.map(p=>{
  const text=(p.content||'').replace(/<[^>]+>/g,'\\n').replace(/&nbsp;/g,' ');
  const get=k=>{const m=text.match(new RegExp(k+'\\\\s*:\\\\s*([^\\\\n<]+)','i'));return m?m[1].trim():''};
  const cats=Object.values(p.categories||{}).map(x=>typeof x==='string'?x:x.name||'');
  return {id:p.ID,title:p.title||'Property',location:get('Location'),purpose:get('Listing Type'),type:get('Property Type')||cats[0]||'',price:get('Price/Rent'),bhk:get('BHK'),area:get('Area'),furnishing:get('Furnishing'),description:get('Description'),url:p.URL||'#',image:p.featured_image||p.post_thumbnail?.URL||''};
 });
 res.json(out);
}