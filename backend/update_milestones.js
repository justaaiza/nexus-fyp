const fs = require('fs');
const path = '../frontend/src/app/pages/student/Milestones.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'const [loading, setLoading] = useState(true);',
  'const [loading, setLoading] = useState(true);\n  const [proposal, setProposal] = useState<any>(null);'
);

content = content.replace(
  'const fetchData = async () => {',
  `const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      try {
          const propRes = await studentAPI.getMyProposal();
          setProposal((propRes as any).data);
          if ((propRes as any).data.status !== "approved") {
              setLoading(false);
              return;
          }
      } catch (e: any) {
          if (e.message === "No proposal found.") setProposal(null);
          setLoading(false);
          return;
      }`
);

content = content.replace(
  'if (loading) {',
  `if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-blue animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading your milestones...</p>
        </div>
      </div>
    );
  }

  if (!proposal || proposal.status !== "approved") {
      return (
          <div className="p-6 space-y-6 max-w-7xl mx-auto flex items-center justify-center min-h-[500px]">
              <div className="p-10 rounded-2xl border-2 border-dashed border-fyp-border flex flex-col items-center justify-center gap-4 bg-fyp-card text-center max-w-2xl">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-fyp-blue/10">
                      <Lock size={28} className="text-fyp-blue" />
                  </div>
                  <div>
                      <h3 className="text-[17px] font-semibold text-fyp-text mb-1">Milestones Locked</h3>
                      <p className="text-sm text-fyp-text-secondary">You must have an approved FYP proposal to access your milestones. Head over to the Dashboard to track your proposal status.</p>
                  </div>
              </div>
          </div>
      );
  }

  if (loading) {` // I will replace the first 'if (loading)' completely, so no duplicate.
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated Milestones.");
