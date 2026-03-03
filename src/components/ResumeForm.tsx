import { ResumeData, WorkExperience, Project, Education } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeForm = ({ data, onChange }: ResumeFormProps) => {
  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const addExperience = () => {
    update("experiences", [
      ...data.experiences,
      { id: crypto.randomUUID(), title: "", company: "", location: "", dates: "", bullets: "" },
    ]);
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string) => {
    update(
      "experiences",
      data.experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeExperience = (id: string) => {
    update("experiences", data.experiences.filter((e) => e.id !== id));
  };

  const addProject = () => {
    update("projects", [
      ...data.projects,
      { id: crypto.randomUUID(), name: "", description: "", bullets: "" },
    ]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    update("projects", data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeProject = (id: string) => {
    update("projects", data.projects.filter((p) => p.id !== id));
  };

  const addEducation = () => {
    update("education", [
      ...data.education,
      { id: crypto.randomUUID(), degree: "", school: "", dates: "", details: "" },
    ]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    update("education", data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeEducation = (id: string) => {
    update("education", data.education.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <section>
        <h3 className="font-display text-lg font-bold text-primary mb-3">Contact Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="john@email.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567" />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="City, State" />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="linkedin.com/in/..." />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section>
        <h3 className="font-display text-lg font-bold text-primary mb-3">Professional Summary</h3>
        <Textarea value={data.summary} onChange={(e) => update("summary", e.target.value)} placeholder="A concise 2-3 line summary..." rows={3} />
      </section>

      {/* Skills */}
      <section>
        <h3 className="font-display text-lg font-bold text-primary mb-3">Skills</h3>
        <Textarea value={data.skills} onChange={(e) => update("skills", e.target.value)} placeholder="JavaScript, React, Node.js..." rows={2} />
      </section>

      {/* Work Experience */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold text-primary">Work Experience</h3>
          <Button variant="outline" size="sm" onClick={addExperience}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {data.experiences.map((exp) => (
          <div key={exp.id} className="border border-border rounded-lg p-4 mb-3 relative">
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeExperience(exp.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <Label>Job Title</Label>
                <Input value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} placeholder="Software Engineer" />
              </div>
              <div>
                <Label>Company</Label>
                <Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Company Name" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} placeholder="City, State" />
              </div>
              <div>
                <Label>Dates</Label>
                <Input value={exp.dates} onChange={(e) => updateExperience(exp.id, "dates", e.target.value)} placeholder="Jan 2022 - Present" />
              </div>
            </div>
            <div>
              <Label>Bullet Points (one per line, max 4)</Label>
              <Textarea value={exp.bullets} onChange={(e) => updateExperience(exp.id, "bullets", e.target.value)} placeholder="Led team of 5 engineers..." rows={4} />
            </div>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold text-primary">Projects</h3>
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {data.projects.map((proj) => (
          <div key={proj.id} className="border border-border rounded-lg p-4 mb-3 relative">
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeProject(proj.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <Label>Project Name</Label>
                <Input value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} placeholder="Project Name" />
              </div>
              <div>
                <Label>Short Description</Label>
                <Input value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} placeholder="Brief description" />
              </div>
            </div>
            <div>
              <Label>Bullet Points (one per line)</Label>
              <Textarea value={proj.bullets} onChange={(e) => updateProject(proj.id, "bullets", e.target.value)} rows={3} />
            </div>
          </div>
        ))}
      </section>

      {/* Education */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold text-primary">Education</h3>
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} className="border border-border rounded-lg p-4 mb-3 relative">
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeEducation(edu.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <Label>Degree</Label>
                <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder="B.S. Computer Science" />
              </div>
              <div>
                <Label>School</Label>
                <Input value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} placeholder="University Name" />
              </div>
              <div>
                <Label>Dates</Label>
                <Input value={edu.dates} onChange={(e) => updateEducation(edu.id, "dates", e.target.value)} placeholder="2015 - 2019" />
              </div>
              <div>
                <Label>Details</Label>
                <Input value={edu.details} onChange={(e) => updateEducation(edu.id, "details", e.target.value)} placeholder="GPA, honors, etc." />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Certifications */}
      <section>
        <h3 className="font-display text-lg font-bold text-primary mb-3">Certifications</h3>
        <Textarea value={data.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="One certification per line" rows={3} />
      </section>
    </div>
  );
};

export default ResumeForm;
