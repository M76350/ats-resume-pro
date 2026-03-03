import { ResumeData } from "@/types/resume";

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview = ({ data }: ResumePreviewProps) => {
  const hasCertifications = data.certifications.trim().length > 0;
  const hasProjects = data.projects.length > 0;
  const hasExperiences = data.experiences.length > 0;
  const hasEducation = data.education.length > 0;
  const hasSkills = data.skills.trim().length > 0;
  const hasSummary = data.summary.trim().length > 0;

  const contactParts = [data.email, data.phone, data.location, data.linkedin].filter(Boolean);

  return (
    <div className="resume-page p-[40px] w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-lg border border-border">
      {/* Contact Information */}
      {data.fullName && (
        <div className="text-center mb-1">
          <h1 className="font-bold">{data.fullName}</h1>
          {contactParts.length > 0 && (
            <p className="text-[10pt] mt-1">{contactParts.join(" | ")}</p>
          )}
        </div>
      )}

      {/* Professional Summary */}
      {hasSummary && (
        <div>
          <h2>Professional Summary</h2>
          <p>{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {hasSkills && (
        <div>
          <h2>Skills</h2>
          <p>{data.skills}</p>
        </div>
      )}

      {/* Work Experience */}
      {hasExperiences && (
        <div>
          <h2>Work Experience</h2>
          {data.experiences.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{exp.title}</span>
                <span className="text-[10pt]">{exp.dates}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic">{exp.company}</span>
                <span className="text-[10pt]">{exp.location}</span>
              </div>
              {exp.bullets.trim() && (
                <ul className="list-disc">
                  {exp.bullets
                    .split("\n")
                    .filter(Boolean)
                    .map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {hasProjects && (
        <div>
          <h2>Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <span className="font-bold">{proj.name}</span>
              {proj.description && <span> - {proj.description}</span>}
              {proj.bullets.trim() && (
                <ul className="list-disc">
                  {proj.bullets
                    .split("\n")
                    .filter(Boolean)
                    .map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {hasEducation && (
        <div>
          <h2>Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{edu.degree}</span>
                <span className="text-[10pt]">{edu.dates}</span>
              </div>
              <div>{edu.school}</div>
              {edu.details && <div className="text-[10pt]">{edu.details}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {hasCertifications && (
        <div>
          <h2>Certifications</h2>
          <ul className="list-disc">
            {data.certifications
              .split("\n")
              .filter(Boolean)
              .map((c, i) => (
                <li key={i}>{c}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
