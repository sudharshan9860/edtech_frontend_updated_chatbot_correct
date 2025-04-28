// src/components/StudentDash.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './StudentDash.css';
import axiosInstance from '../api/axiosInstance';
import QuestionListModal from './QuestionListModal';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSchool, 
  faBookOpen, 
  faListAlt, 
  faClipboardQuestion,
  faGraduationCap,
  faHome,
  faChartLine,
  faTrophy,
  faHistory,
  faBook,
  faBookReader
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from './AuthContext';

function StudentDash() {
  const navigate = useNavigate();
  const { username } = useContext(AuthContext);

  // State for dropdown data
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subtopicSets, setSubtopicSets] = useState([]);

  // State for selections
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState('');
  const [questionLevel, setQuestionLevel] = useState('');
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [recentQuestionSets, setRecentQuestionSets] = useState([
    { id: 1, title: 'Circles - Exercise 2', date: '2 days ago' },
    { id: 2, title: 'Trigonometry Practice', date: '5 days ago' },
    { id: 3, title: 'Algebra - Solved Examples', date: '1 week ago' }
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const classResponse = await axiosInstance.get('/classes/');
        const classesData = classResponse.data.data;
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching classes', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchSubjects() {
      if (selectedClass) {
        try {
          const subjectResponse = await axiosInstance.post('/subjects/', {
            class_id: selectedClass
          });
          setSubjects(subjectResponse.data.data);
        } catch (error) {
          console.error('Error fetching subjects:', error);
          setSubjects([]);
        }
      }
    }
    fetchSubjects();
  }, [selectedClass]);

  useEffect(() => {
    async function fetchChapters() {
      if (selectedSubject && selectedClass) {
        try {
          const chapterResponse = await axiosInstance.post('/chapters/', {
            subject_id: selectedSubject,
            class_id: selectedClass,
          });
          setChapters(chapterResponse.data.data);
        } catch (error) {
          console.error('Error fetching chapters:', error);
          setChapters([]);
        }
      }
    }
    fetchChapters();
  }, [selectedSubject, selectedClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!questionType || 
      (questionType !== 'solved' && 
       questionType !== 'exercise' && 
       questionType !== 'external')) {
      console.error('Please select a valid question type');
      return;
    }
    
    const requestData = {
      classid: Number(selectedClass),
      subjectid: Number(selectedSubject),
      topicid: selectedChapters,
      solved: questionType === 'solved',
      exercise: questionType === 'exercise',
      external: questionType === 'external' ? questionLevel : null
    };
    
    try {
      const response = await axiosInstance.post('/question-images/', requestData);
      // Process questions with images
      const questionsWithImages = response.data.questions.map(question => ({
        ...question,
        question: question.question,
        image: question.question_image ? `data:image/png;base64,${question.question_image}` : null
      }));
      
      setQuestionList(questionsWithImages);
      setShowQuestionList(true);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please try again.');
    }
  };

  const handleQuestionClick = (question, index, image) => {
    navigate('/solvequestion', {
      state: {
        question,
        questionNumber: index + 1,
        questionList,
        class_id: selectedClass,
        subject_id: selectedSubject,
        topic_ids: selectedChapters,
        subtopic: '',
        image
      }
    });
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const sidebarItems = [
    { icon: faHome, label: 'Dashboard', path: '/student-dash', active: true },
    { icon: faChartLine, label: 'Analytics', path: '/analytics' },
    { icon: faGraduationCap, label: 'Progress', path: '/progress-dashboard' },
    { icon: faTrophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: faClipboardQuestion, label: 'Quests', path: '/quests' },
    { icon: faHistory, label: 'Study History', path: '#' },
    { icon: faBook, label: 'Resources', path: '#' }
  ];

  return (
    <div className="student-dash-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="user-profile">
          <div className="avatar-circle">
            {username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="welcome-text">
            <p>Welcome back,</p>
            <h6>{username || 'Student'}</h6>
          </div>
        </div>
        
        <div className="sidebar-menu">
          {sidebarItems.map((item, index) => (
            <div 
              key={index} 
              className={`sidebar-item ${item.active ? 'active' : ''}`}
              onClick={() => navigateTo(item.path)}
            >
              <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="page-header">
          <h2>Welcome to Your Learning Journey</h2>
        </div>

        <div className="study-session-card">
          <h4 className="card-title">
            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
            AI-Powered Study Session
          </h4>
          
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formClass">
                  <Form.Label className="form-label">
                    <FontAwesomeIcon icon={faSchool} className="me-2" />
                    Class
                  </Form.Label>
                  <Form.Select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.class_code} value={cls.class_code}>
                        {cls.class_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formSubject">
                  <Form.Label className="form-label">
                    <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                    Subject
                  </Form.Label>
                  <Form.Select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.subject_code} value={subject.subject_code}>
                        {subject.subject_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formChapters">
                  <Form.Label className="form-label">
                    <FontAwesomeIcon icon={faListAlt} className="me-2" />
                    Chapters
                  </Form.Label>
                  <Select
                    isMulti
                    options={chapters.map((chapter) => ({
                      value: chapter.topic_code,
                      label: chapter.name,
                    }))}
                    value={selectedChapters.map((code) => ({
                      value: code,
                      label: chapters.find((chapter) => chapter.topic_code === code)?.name
                    }))}
                    onChange={(selectedOptions) => {
                      setSelectedChapters(selectedOptions.map(option => option.value));
                    }}
                    classNamePrefix="react-select"
                    placeholder="Select Chapters"
                    className="chapter-select"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formQuestionType">
                  <Form.Label className="form-label">
                    <FontAwesomeIcon icon={faClipboardQuestion} className="me-2" />
                    Question Type
                  </Form.Label>
                  <Form.Select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Question Type</option>
                    <option value="solved">Solved</option>
                    <option value="exercise">Exercise</option>
                    <option value="external">External</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {questionType === 'external' && (
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="formQuestionLevel">
                    <Form.Label className="form-label">
                      <FontAwesomeIcon icon={faClipboardQuestion} className="me-2" />
                      Question Level
                    </Form.Label>
                    <Form.Select
                      value={questionLevel}
                      onChange={(e) => setQuestionLevel(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Level</option>
                      <option value="level-1">Level 1</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" className="generate-btn mt-3">
                Generate Questions
              </Button>
            </div>
          </Form>
        </div>

        {/* Recent Sessions Section */}
        <div className="recent-sessions">
          <h4 className="section-title">
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            Recent Sessions
          </h4>
          <div className="session-cards">
            {recentQuestionSets.map(set => (
              <div key={set.id} className="session-card" onClick={() => setShowQuestionList(true)}>
                <div className="session-icon">
                  <FontAwesomeIcon icon={faBookReader} />
                </div>
                <div className="session-info">
                  <h5>{set.title}</h5>
                  <p className="session-date">{set.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuestionListModal
        show={showQuestionList}
        onHide={() => setShowQuestionList(false)}
        questionList={questionList}
        onQuestionClick={handleQuestionClick}
      />
    </div>
  );
}

export default StudentDash;