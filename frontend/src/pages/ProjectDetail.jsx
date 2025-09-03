import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Globe, Code, CheckCircle, TrendingUp } from 'lucide-react';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    const fetchProject = async () => {
      setLoading(true);
      setError('');
      try {
        const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
        const res = await fetch(`${baseUrl}/api/projects/${slug}`);
        if (!res.ok) {
          let msg = `Failed to load project (${res.status})`;
          try {
            const err = await res.json();
            if (err?.message) msg = err.message;
          } catch (e) {}
          throw new Error(msg);
        }
        const data = await res.json();
        if (!isCancelled) setProject(data);
      } catch (e) {
        if (!isCancelled) setError(e?.message || 'Failed to load project');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    fetchProject();
    return () => { isCancelled = true; };
  }, [slug]);

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    const loadRelated = async () => {
      if (!project?.category) { setRelatedProjects([]); return; }
      try {
        const params = new URLSearchParams({ category: project.category, limit: '6' });
        const res = await fetch(`${baseUrl}/api/projects?${params.toString()}`);
        if (!res.ok) { setRelatedProjects([]); return; }
        const list = await res.json();
        const items = Array.isArray(list?.items) ? list.items : [];
        const filtered = items.filter(p => p.slug !== project.slug).slice(0, 3);
        setRelatedProjects(filtered);
      } catch {
        setRelatedProjects([]);
      }
    };
    loadRelated();
  }, [project?.category, project?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Helmet>
          <title>Loading project... | Taliyo Technologies Portfolio</title>
        </Helmet>
        <p className="text-gray-400">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Helmet>
          <title>Project - Error | Taliyo Technologies Portfolio</title>
          <meta name="description" content="Error loading project" />
        </Helmet>
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <Link to="/projects" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Projects
            </Link>
            <h1 className="text-3xl font-bold mb-4">Unable to load project</h1>
            <p className="text-gray-400">{error}</p>
          </div>
        </section>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Helmet>
          <title>Project Not Found | Taliyo Technologies Portfolio</title>
        </Helmet>
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <Link to="/projects" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Back to Projects
            </Link>
            <h1 className="text-3xl font-bold mb-4">Project not found</h1>
            <p className="text-gray-400">The project you're looking for doesn't exist.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet>
        <title>{project.title} | Taliyo Technologies Portfolio</title>
        <meta name="description" content={project.overview || project.description || ''} />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <Link to="/projects" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Projects
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">{project.category}</span>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  {project.duration || '—'}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={16} />
                  {Array.isArray(project.team) ? `${project.team.length} ${project.team.length === 1 ? 'member' : 'members'}` : (project.team || '—')}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {project.title}
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {project.overview || project.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Globe size={20} className="mr-2" />
                    View Live
                  </a>
                )}
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 font-semibold rounded-xl transition-all"
                  >
                    <Code size={20} className="mr-2" />
                    View Code
                  </a>
                )}
              </div>
            </div>
            
            <div>
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Challenge & Solution */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">The Challenge</h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                {project.challenge}
              </p>
              
              <h2 className="text-3xl font-bold text-white mb-8">Our Solution</h2>
              <p className="text-gray-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
            
            {/* Technologies & Features */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Technologies Used</h2>
              <div className="flex flex-wrap gap-3 mb-8">
                {(project.technologies || []).map(tech => (
                  <span key={tech} className="px-4 py-2 bg-gray-800 text-blue-300 rounded-lg font-medium">
                    {tech}
                  </span>
                ))}
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-8">Key Features</h2>
              <div className="space-y-4">
                {(project.features || []).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Development Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {(project.process || []).map((phase, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{phase.phase}</h3>
                    <p className="text-gray-300 mb-2">{phase.description}</p>
                    <span className="text-blue-400 font-medium">{phase.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Results & Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(project.results || []).map((result, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl p-8 text-center border border-blue-500/10">
                <TrendingUp className="text-blue-400 mx-auto mb-4" size={32} />
                <p className="text-white text-lg font-semibold">{result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(project.gallery || []).map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${project.title} screenshot ${index + 1}`}
                className="w-full rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map(relatedProject => (
                <Link key={relatedProject.slug} to={`/projects/${relatedProject.slug}`} className="group">
                  <div className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-700 transition-colors">
                    {relatedProject.image ? (
                      <img 
                        src={relatedProject.image} 
                        alt={relatedProject.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-700" />
                    )}
                    <div className="p-6">
                      <span className="text-blue-400 text-sm font-medium">{relatedProject.category || 'Project'}</span>
                      <h3 className="text-xl font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                        {relatedProject.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectDetail;