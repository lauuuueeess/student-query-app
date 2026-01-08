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
      backgroundColor: '#f2f2f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI\", system-ui, sans-serif',
      letterSpacing: '0.03em',
      color: '#0f172a'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '28px'
      }}>
        {/* 标题 */}
        <h1 style={{
          margin: 0,
          fontSize: '34px',
          fontWeight: 600,
          color: '#020617',
          textAlign: 'center',
          letterSpacing: '0.06em'
        }}>
          学生档案查询系统
        </h1>

        {/* 提示文字 */}
        <p style={{
          margin: '4px 0 0',
          fontSize: '14px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          请输入学号 S202411132 进行查询
        </p>

        {/* 输入卡片区域 */}
        <div style={{
          marginTop: '12px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '20px 24px 18px',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入学号"
              style={{
                flex: 1,
                minWidth: '0',
                padding: '12px 18px',
                fontSize: '15px',
                border: '1px solid #e5e7eb',
                borderRadius: '999px',
                outline: 'none',
                transition: 'border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease',
                boxSizing: 'border-box',
                backgroundColor: '#f9fafb',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
                e.target.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = '#f9fafb';
              }}
            />
            <button
              onClick={handleQuery}
              disabled={loading}
              style={{
                padding: '11px 26px',
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#e5f0ff',
                backgroundColor: loading ? '#64748b' : '#1d4ed8',
                border: 'none',
                borderRadius: '999px',
                cursor: loading ? 'not-allowed' : 'pointer',
                minWidth: '160px',
                transform: 'translateZ(0)',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)',
                transition: 'background-color 0.2s ease, transform 0.16s ease-out, box-shadow 0.16s ease-out',
                willChange: 'transform'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1e40af';
                  e.currentTarget.style.transform = 'scale(1.03) translateZ(0)';
                  e.currentTarget.style.boxShadow = '0 18px 40px rgba(30, 64, 175, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                  e.currentTarget.style.transform = 'scale(1) translateZ(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.25)';
                }
              }}
            >
              {loading ? '查询中...' : '立即查询'}
            </button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            width: '100%',
            maxWidth: '420px',
            padding: '10px 14px',
            marginTop: '6px',
            backgroundColor: '#fef3c7',
            border: '1px solid #facc15',
            borderRadius: '999px',
            color: '#92400e',
            textAlign: 'center',
            fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        {/* 学生信息卡片 */}
        {student && (
          <div style={{
            width: '100%',
            maxWidth: '520px',
            padding: '22px 24px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '26px',
            boxShadow: '0 22px 55px rgba(15, 23, 42, 0.18)',
            border: '1px solid rgba(148, 163, 184, 0.22)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              inset: '-40%',
              background: 'radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.12), transparent 60%)'
            }} />
            <div style={{
              position: 'relative',
              borderBottom: '1px solid rgba(148, 163, 184, 0.3)',
              paddingBottom: '10px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '16px',
                color: '#0f172a',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase'
              }}>
                学生档案
              </h2>
              <span style={{
                fontSize: '11px',
                color: '#6b7280',
                letterSpacing: '0.16em',
                textTransform: 'uppercase'
              }}>
                Student Profile
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '18px',
              alignItems: 'stretch',
              position: 'relative',
              zIndex: 1
            }}>
              {/* 左侧头像区域 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 16px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(15, 23, 42, 0.02))',
                minWidth: '120px'
              }}>
                <span style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '999px',
                  background: 'radial-gradient(circle at 30% 20%, #bfdbfe, #1d4ed8)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#eff6ff',
                  fontWeight: 600,
                  fontSize: '22px',
                  boxShadow: '0 16px 40px rgba(37, 99, 235, 0.45)'
                }}>
                  {student.name?.[0] ?? '学'}
                </span>
                <span style={{
                  marginTop: '10px',
                  fontSize: '13px',
                  color: '#0f172a',
                  fontWeight: 500,
                  maxWidth: '100%',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}>
                  {student.name}
                </span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '4px 4px 4px 0',
                gap: '10px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                  columnGap: '18px',
                  rowGap: '8px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em'
                    }}>
                      学号 / ID
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: 500
                    }}>
                      {student.sid}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em'
                    }}>
                      学院 / College
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: 500
                    }}>
                      {student.college}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em'
                    }}>
                      专业 / Major
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: 500
                    }}>
                      {student.major}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 底部标识 */}
        <div style={{
          marginTop: '40px',
          paddingTop: '16px',
          width: '100%',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#9ca3af',
            letterSpacing: '0.16em',
            textTransform: 'uppercase'
          }}>
            全栈架构展示：React + Vite + PocketBase
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

