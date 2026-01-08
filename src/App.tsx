import { useState } from 'react';
import PocketBase from 'pocketbase';

// 建立 PocketBase 连接
const pb = new PocketBase('http://127.0.0.1:8090');

interface Student {
  id: string;
  name: string;
  college: string;
  major: string;
  sid: string;
}

function App() {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!studentId.trim()) {
      setError('请输入学号');
      setStudent(null);
      return;
    }

    setLoading(true);
    setError('');
    setStudent(null);

    try {
      // 查询 students 集合中 sid 等于输入内容的记录
      const records = await pb.collection('students').getList(1, 1, {
        filter: `sid = "${studentId.trim()}"`,
      });

      if (records.items.length > 0) {
        const record = records.items[0];
        const foundStudent: Student = {
          id: record.id,
          name: record.name as string,
          college: record.college as string,
          major: record.major as string,
          sid: record.sid as string,
        };
        setStudent(foundStudent);
        setError('');
      } else {
        setError('档案库中未找到该学号');
        setStudent(null);
      }
    } catch (err) {
      console.error('查询失败:', err);
      setError('查询失败，请检查网络连接或后端服务');
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px'
      }}>
        {/* 标题 */}
        <h1 style={{
          margin: 0,
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center'
        }}>
          学生档案查询系统
        </h1>

        {/* 提示文字 */}
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: '#666',
          textAlign: 'center'
        }}>
          请输入学号 S202411132 进行查询
        </p>

        {/* 输入框和按钮 */}
        <div style={{
          width: '100%',
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="请输入学号"
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '12px 16px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.3s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <button
            onClick={handleQuery}
            disabled={loading}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: loading ? '#999' : '#4a90e2',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              minWidth: '150px'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#357abd';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#4a90e2';
            }}
          >
            {loading ? '查询中...' : '立即查询'}
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px 16px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            color: '#856404',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* 学生信息卡片 */}
        {student && (
          <div style={{
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              borderBottom: '1px solid #eee',
              paddingBottom: '12px',
              marginBottom: '8px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                color: '#333',
                fontWeight: 'bold'
              }}>
                学生信息
              </h2>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: 'bold'
                }}>
                  姓名：
                </span>
                <span style={{
                  fontSize: '16px',
                  color: '#333'
                }}>
                  {student.name}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: 'bold'
                }}>
                  学院：
                </span>
                <span style={{
                  fontSize: '16px',
                  color: '#333'
                }}>
                  {student.college}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: 'bold'
                }}>
                  专业：
                </span>
                <span style={{
                  fontSize: '16px',
                  color: '#333'
                }}>
                  {student.major}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 底部标识 */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid #ddd',
          width: '100%',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#999'
          }}>
            全栈架构展示：React + Vite + PocketBase
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

