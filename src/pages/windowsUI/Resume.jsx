const Resume = () => {
    const resumePath = "/assets/resume/KushalSM_Resume_CV.pdf#navpanes=0&zoom=80";

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <iframe
                src={resumePath}
                style={{ width: "100%", flex: 1, border: "none" }}
                title="Resume"
            />
        </div>
    );
};

export default Resume;
