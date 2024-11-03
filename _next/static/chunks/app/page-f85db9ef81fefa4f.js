(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{8e3:(e,t,n)=>{Promise.resolve().then(n.bind(n,3233))},3233:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>p});var a=n(7437),i=n(2265);let r=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter((e,t,n)=>!!e&&""!==e.trim()&&n.indexOf(e)===t).join(" ").trim()};var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let l=(0,i.forwardRef)((e,t)=>{let{color:n="currentColor",size:a=24,strokeWidth:r=2,absoluteStrokeWidth:l,className:c="",children:d,iconNode:m,...u}=e;return(0,i.createElement)("svg",{ref:t,...o,width:a,height:a,stroke:n,strokeWidth:l?24*Number(r)/Number(a):r,className:s("lucide",c),...u},[...m.map(e=>{let[t,n]=e;return(0,i.createElement)(t,n)}),...Array.isArray(d)?d:[d]])}),c=(e,t)=>{let n=(0,i.forwardRef)((n,a)=>{let{className:o,...c}=n;return(0,i.createElement)(l,{ref:a,iconNode:t,className:s("lucide-".concat(r(e)),o),...c})});return n.displayName="".concat(e),n},d=c("Flame",[["path",{d:"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",key:"96xj49"}]]),m=c("Skull",[["path",{d:"m12.5 17-.5-1-.5 1h1z",key:"3me087"}],["path",{d:"M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",key:"1o5pge"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}]]),u={countFileChanges:(e,t)=>{let n=t?' --grep="'.concat(t.split(",").join("|"),'" -i'):"";return'git log --since="'.concat(e,' ago"').concat(n," --name-only --pretty=format:")},getAuthors:(e,t)=>'git log --since="'.concat(t,' ago" --pretty=format:"%an" -- "').concat(e,'" | sort -u'),getAuthorContributions:(e,t)=>'git log --since="'.concat(t,' ago" --pretty=format:"%an" -- "').concat(e,'" | sort | uniq -c | sort -nr')},h=[{id:"hotspots",icon:d,title:"Hotspots \uD83C\uDF36️",description:"Track frequently changing files that might need attention",params:[{name:"timeWindow",label:"Time Window",type:"select",options:["1 month","3 months","6 months","1 year","2 years"],defaultValue:"6 months"},{name:"keywords",label:"Filter by commit messages",type:"text",defaultValue:"fix,bug,refactor",description:"Optional: filter by keywords in commit messages"},{name:"limit",label:"Show top files",type:"number",min:5,max:50,defaultValue:10}],generateCommand:e=>"\n# Find most frequently changed files\n".concat(u.countFileChanges(e.timeWindow,e.keywords)," | \\\n  sort | \\\n  uniq -c | \\\n  sort -nr | \\\n  head -").concat(e.limit,"\n  ")},{id:"dungeons",icon:m,title:"Dungeons \uD83D\uDC80",description:"Find files with high activity but few contributors",params:[{name:"timeWindow",label:"Time Window",type:"select",options:["1 month","3 months","6 months","1 year","2 years"],defaultValue:"1 year"},{name:"keywords",label:"Filter by commit messages",type:"text",defaultValue:"fix,bug,refactor",description:"Optional: filter by keywords in commit messages"},{name:"minChanges",label:"Minimum changes",type:"number",min:1,max:100,defaultValue:5},{name:"maxAuthors",label:"Maximum authors",type:"number",min:1,max:10,defaultValue:2}],generateCommand:e=>"\n# Get all unique files from git history\nfiles=$(".concat(u.countFileChanges(e.timeWindow,e.keywords),' | sort -u)\n\n# For each file, check changes and authors\necho "$files" | while read -r file; do\n  if [ ! -z "$file" ]; then\n    # Count changes\n    changes=$(').concat(u.countFileChanges(e.timeWindow,e.keywords),' | grep -c "^$file" || echo 0)\n    \n    # If changes meet minimum threshold\n    if [ "$changes" -ge ').concat(e.minChanges," ]; then\n      # Count unique authors\n      author_count=$(").concat(u.getAuthors("$file",e.timeWindow),' | wc -l)\n      \n      # If author count is within maximum\n      if [ "$author_count" -le ').concat(e.maxAuthors,' ]; then\n        echo "File: $file"\n        echo "Changes: $changes"\n        echo "Authors: "\n        ').concat(u.getAuthorContributions("$file",e.timeWindow),' | \\\n          awk \'{\n            count=$1\n            author=$2\n            for(i=3;i<=NF;i++) author=author " " $i\n            printf "  %s: %d changes\\n", author, count\n          }\'\n        echo "---"\n      fi\n    fi\n  fi\ndone\n')}],x=e=>{let{pattern:t}=e,[n,r]=(0,i.useState)(()=>t.params.reduce((e,t)=>({...e,[t.name]:t.defaultValue}),{})),s=(e,t)=>{r(n=>({...n,[e.name]:t}))},o=t.generateCommand(n);return(0,a.jsxs)("div",{className:"rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden",children:[(0,a.jsxs)("div",{className:"p-4 flex items-center gap-3 border-b border-[#30363d]",children:[(0,a.jsx)(t.icon,{className:"w-5 h-5"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"text-[#c9d1d9] font-medium",children:t.title}),(0,a.jsx)("p",{className:"text-[#8b949e] text-sm",children:t.description})]})]}),(0,a.jsxs)("div",{className:"p-4 space-y-4",children:[t.params.map(e=>{var t;return(0,a.jsxs)("div",{className:"space-y-1.5",children:[(0,a.jsxs)("label",{className:"text-[#c9d1d9] text-sm font-medium",children:[e.label,e.description&&(0,a.jsx)("span",{className:"text-[#8b949e] ml-2 text-xs font-normal",children:e.description})]}),"select"===e.type?(0,a.jsx)("select",{value:String(n[e.name]),onChange:t=>s(e,t.target.value),className:"w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[#c9d1d9] text-sm",children:null===(t=e.options)||void 0===t?void 0:t.map(e=>(0,a.jsx)("option",{value:e,children:e},e))}):"number"===e.type?(0,a.jsx)("input",{type:"number",value:Number(n[e.name]),onChange:t=>s(e,Number(t.target.value)),min:e.min,max:e.max,className:"w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[#c9d1d9] text-sm"}):(0,a.jsx)("input",{type:"text",value:String(n[e.name]),onChange:t=>s(e,t.target.value),className:"w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[#c9d1d9] text-sm"})]},e.name)}),(0,a.jsxs)("div",{className:"mt-4",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,a.jsx)("label",{className:"text-[#c9d1d9] text-sm font-medium",children:"Generated Command"}),(0,a.jsx)("button",{onClick:()=>navigator.clipboard.writeText(o),className:"text-xs px-2.5 py-1 rounded-md bg-[#238636] text-white hover:bg-[#2ea043] transition-colors",children:"Copy"})]}),(0,a.jsx)("pre",{className:"bg-[#0d1117] p-4 rounded-md overflow-x-auto text-[#c9d1d9] text-sm",children:(0,a.jsx)("code",{children:o})})]})]})]})};function p(){return(0,a.jsx)("div",{className:"min-h-screen bg-[#0d1117] text-[#c9d1d9] p-6",children:(0,a.jsxs)("div",{className:"max-w-5xl mx-auto space-y-6",children:[(0,a.jsxs)("header",{className:"text-center py-8",children:[(0,a.jsx)("h1",{className:"text-3xl font-bold mb-4",children:"Git Spotlight"}),(0,a.jsx)("p",{className:"text-[#8b949e] max-w-2xl mx-auto",children:"Discover insights in your git history with these carefully crafted command patterns. Each pattern helps you identify different aspects of your codebase."})]}),(0,a.jsx)("div",{className:"grid grid-cols-1 gap-6",children:h.map(e=>(0,a.jsx)(x,{pattern:e},e.id))}),(0,a.jsx)("footer",{className:"text-center text-[#8b949e] text-sm py-8",children:(0,a.jsxs)("p",{children:["Originally presented in ",(0,a.jsx)("span",{className:"text-[#ffffff]",children:'"Pinpointing Pain Points in Your Code: Effective Value-Driven Refactoring"'}),(0,a.jsx)("br",{}),(0,a.jsx)("span",{className:"text-[#8b949e]",children:"by Asaf Korem • Wix Engineering Conference 2024"})]})})]})})}}},e=>{var t=t=>e(e.s=t);e.O(0,[130,215,744],()=>t(8e3)),_N_E=e.O()}]);