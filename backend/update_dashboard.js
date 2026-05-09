const fs = require('fs');
const path = '../frontend/src/app/pages/student/Dashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// replace state logic
content = content.replace(
  'const [form, setForm] = useState({ title: "", description: "", domain: "", groupNo: "" });',
  `const [form, setForm] = useState({ title: "", description: "", domain: "", groupNo: "", teamMembers: [] as string[], supervisorPreference: "" });
  const [options, setOptions] = useState<{ availableStudents: any[], supervisors: any[] }>({ availableStudents: [], supervisors: [] });
  
  useEffect(() => {
    studentAPI.getProposalOptions().then((res: any) => setOptions(res.data)).catch(console.error);
  }, []);
  
  useEffect(() => {
    if (proposal) {
        setForm({
            title: proposal.title,
            description: proposal.description,
            domain: proposal.domain || "",
            groupNo: proposal.groupNo || "",
            teamMembers: proposal.teamMembers?.map(m => m._id) || [],
            supervisorPreference: proposal.supervisorPreference?._id || ""
        });
    }
  }, [proposal]);
  `
);

content = content.replace(
  "const handleSubmitProposal = async (e: React.FormEvent) => {",
  `const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    try {
      setSubmitting(true);
      let res;
      if (proposal) {
          res = await studentAPI.updateProposal(proposal._id, form) as { success: boolean; data: Proposal };
      } else {
          res = await studentAPI.submitProposal(form) as { success: boolean; data: Proposal };
      }
      setProposal(res.data);
      setShowForm(false);
    } catch (err: unknown) {`
);

content = content.replace(
  `setForm({ title: "", description: "", domain: "", groupNo: "" });`,
  `// setForm({ title: "", description: "", domain: "", groupNo: "", teamMembers: [], supervisorPreference: "" });`
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated Dashboard base state.");
