import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const hashedPassword = await hash('Iamcp0byte!', 12);
  await prisma.user.upsert({
    where: { email: 'mulroonyt@gmail.com' },
    update: {},
    create: {
      email: 'mulroonyt@gmail.com',
      hashedPassword,
      name: 'Tyler Mulroony',
    },
  });
  console.log('Admin user created');

  // Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heroTagline: 'Securing systems. Building solutions. Breaking assumptions.',
      aboutBio: `<p>I'm a cybersecurity professional and full-stack developer with a passion for building secure systems and breaking insecure ones. My career spans penetration testing, network security architecture, incident response, and modern web development.</p>
<p>I believe that understanding how to build software makes you better at breaking it — and vice versa. This dual perspective drives everything I do, from designing secure applications to conducting thorough security assessments.</p>
<p>With experience across enterprise environments, startups, and consulting firms, I bring a pragmatic approach to security that balances risk mitigation with business objectives. I specialize in web application security, network penetration testing, and building custom security tooling.</p>
<p>When I'm not hunting vulnerabilities or writing code, you'll find me contributing to open-source security tools, competing in CTF events, and mentoring the next generation of cybersecurity professionals.</p>`,
      certifications: JSON.stringify([
        { name: 'OSCP', issuer: 'Offensive Security', year: '2023' },
        { name: 'CompTIA Security+', issuer: 'CompTIA', year: '2021' },
        { name: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', year: '2022' },
        { name: 'CompTIA Network+', issuer: 'CompTIA', year: '2020' },
        { name: 'CEH', issuer: 'EC-Council', year: '2022' },
      ]),
      socialLinks: JSON.stringify({
        github: 'https://github.com/tylermulroony',
        linkedin: 'https://linkedin.com/in/tylermulroony',
      }),
      contactInfo: JSON.stringify({
        email: 'tyler@tylermulroony.com',
        location: 'New Jersey Metropolitan Area',
      }),
      defaultTheme: 'stealth',
    },
  });
  console.log('Site settings created');

  // Projects
  const projects = [
    {
      title: 'NetRecon — Network Vulnerability Scanner',
      slug: 'netrecon-vulnerability-scanner',
      shortDesc: 'An automated network reconnaissance and vulnerability scanning toolkit built in Python. Combines Nmap, custom scripts, and CVE databases for comprehensive infrastructure assessment.',
      fullDesc: `<h2>Overview</h2>
<p>NetRecon is a comprehensive network vulnerability scanner designed for penetration testers and security teams. It automates the reconnaissance phase of security assessments by combining multiple scanning techniques into a single, streamlined workflow.</p>

<h2>Key Features</h2>
<ul>
<li><strong>Automated Discovery:</strong> Identifies live hosts, open ports, and running services across target networks using parallelized scanning</li>
<li><strong>CVE Correlation:</strong> Cross-references discovered services with the National Vulnerability Database (NVD) to identify known vulnerabilities</li>
<li><strong>Custom Script Engine:</strong> Extensible plugin system for running custom vulnerability checks written in Python</li>
<li><strong>Report Generation:</strong> Produces detailed HTML and PDF reports with risk ratings, remediation recommendations, and executive summaries</li>
<li><strong>API Integration:</strong> RESTful API for integration with existing security workflows and SIEM platforms</li>
</ul>

<h2>Technical Architecture</h2>
<p>Built with a modular architecture using Python asyncio for concurrent scanning. The core engine manages a task queue that distributes work across multiple scanning modules. Results are stored in a SQLite database and can be exported in multiple formats.</p>

<h2>Results</h2>
<p>Reduced average reconnaissance time by 60% compared to manual scanning workflows. Successfully deployed across multiple client engagements identifying critical vulnerabilities including misconfigured services, default credentials, and unpatched systems.</p>`,
      category: 'Cybersecurity',
      techStack: JSON.stringify(['Python', 'Nmap', 'SQLite', 'FastAPI', 'Docker', 'asyncio']),
      featured: true,
      published: true,
    },
    {
      title: 'SecureVault — Encrypted File Transfer Portal',
      slug: 'securevault-file-transfer',
      shortDesc: 'A zero-knowledge encrypted file sharing platform with end-to-end encryption, expiring links, and audit logging. Built for organizations that need to transfer sensitive data securely.',
      fullDesc: `<h2>Overview</h2>
<p>SecureVault is a self-hosted file transfer platform designed for organizations that handle sensitive data. It provides end-to-end encryption with zero-knowledge architecture — the server never has access to unencrypted file contents.</p>

<h2>Key Features</h2>
<ul>
<li><strong>End-to-End Encryption:</strong> Files are encrypted client-side using AES-256-GCM before upload. Encryption keys never leave the sender's browser</li>
<li><strong>Expiring Links:</strong> Shared files can be configured with expiration times, download limits, and password protection</li>
<li><strong>Audit Logging:</strong> Complete audit trail of all file operations for compliance requirements</li>
<li><strong>SSO Integration:</strong> SAML 2.0 and OIDC support for enterprise authentication</li>
<li><strong>Admin Dashboard:</strong> Real-time monitoring of storage usage, active transfers, and user activity</li>
</ul>

<h2>Security Measures</h2>
<p>Implements defense-in-depth with TLS 1.3 for transport security, AES-256-GCM for file encryption, Argon2id for password hashing, and CSP headers to prevent XSS. Regular security audits and penetration testing are conducted against the platform.</p>

<h2>Impact</h2>
<p>Deployed across three organizations handling HIPAA-regulated data. Replaced insecure email attachment workflows and reduced data exposure risk by eliminating persistent file storage on third-party platforms.</p>`,
      category: 'Web Development',
      techStack: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Web Crypto API', 'Docker']),
      featured: true,
      published: true,
    },
    {
      title: 'CloudGuard — AWS Infrastructure Auditor',
      slug: 'cloudguard-aws-auditor',
      shortDesc: 'An infrastructure-as-code security scanner that audits AWS environments against CIS benchmarks, identifies misconfigurations, and generates remediation playbooks.',
      fullDesc: `<h2>Overview</h2>
<p>CloudGuard is an automated security auditing tool for AWS environments. It scans cloud infrastructure configurations against industry benchmarks and best practices, identifying security misconfigurations before they become vulnerabilities.</p>

<h2>Key Features</h2>
<ul>
<li><strong>CIS Benchmark Scanning:</strong> Automated checks against 200+ CIS AWS Foundations Benchmark controls</li>
<li><strong>IAM Analysis:</strong> Deep analysis of IAM policies, roles, and permissions to identify overly permissive access</li>
<li><strong>Terraform Integration:</strong> Scans Terraform plans and state files to catch misconfigurations before deployment</li>
<li><strong>Remediation Playbooks:</strong> Generates step-by-step remediation guides with Terraform code snippets for fixing identified issues</li>
<li><strong>Slack Notifications:</strong> Real-time alerts for critical findings via Slack webhook integration</li>
<li><strong>Historical Tracking:</strong> Tracks security posture over time with trend analysis and compliance dashboards</li>
</ul>

<h2>Architecture</h2>
<p>Built as a serverless application using AWS Lambda for scanning, DynamoDB for results storage, and a React dashboard for visualization. Scans are triggered on a schedule via EventBridge or on-demand via API Gateway.</p>

<h2>Results</h2>
<p>Identified an average of 47 misconfigurations per environment on initial scan. Helped reduce mean-time-to-remediation from 14 days to 3 days by providing actionable remediation guidance directly in the scan results.</p>`,
      category: 'Cloud Security',
      techStack: JSON.stringify(['Python', 'AWS Lambda', 'Terraform', 'React', 'DynamoDB', 'boto3']),
      featured: true,
      published: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }
  console.log(`${projects.length} projects created`);

  // Blog Posts
  const blogPosts = [
    {
      title: 'Dissecting a Real-World SQL Injection: From Discovery to Remediation',
      slug: 'dissecting-real-world-sql-injection',
      excerpt: 'A detailed walkthrough of discovering and exploiting a SQL injection vulnerability during a penetration test, including the full attack chain and remediation steps.',
      content: `## Introduction

During a recent penetration testing engagement, I discovered a critical SQL injection vulnerability in a client's authentication system. This writeup walks through the discovery process, exploitation, impact assessment, and remediation — with all identifying details changed to protect the client.

## Discovery

The target application was a B2B SaaS platform with a standard login form. Initial reconnaissance with Burp Suite revealed that the login endpoint accepted JSON payloads:

\`\`\`http
POST /api/v1/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "test123"
}
\`\`\`

What caught my attention was the error response when I submitted a malformed email:

\`\`\`json
{
  "error": "Invalid credentials",
  "debug": "SELECT * FROM users WHERE email = 'user@example.com' AND active = 1"
}
\`\`\`

The application was leaking the SQL query in debug output. This is a classic information disclosure vulnerability that immediately suggests the possibility of SQL injection.

## Confirming the Vulnerability

I tested with a simple payload in the email field:

\`\`\`
' OR '1'='1' --
\`\`\`

The server responded with a 200 status and returned a valid JWT token — confirming the SQL injection. The application was concatenating user input directly into the SQL query without parameterization.

## Escalation

With confirmed SQLi, I escalated methodically:

### Step 1: Database Enumeration

Using UNION-based injection, I enumerated the database schema:

\`\`\`sql
' UNION SELECT table_name, NULL, NULL, NULL FROM information_schema.tables --
\`\`\`

This revealed tables including \`users\`, \`api_keys\`, \`billing\`, and \`audit_logs\`.

### Step 2: Data Extraction

I extracted the users table structure and found passwords were stored as unsalted MD5 hashes — another critical finding:

\`\`\`sql
' UNION SELECT email, password_hash, role, NULL FROM users LIMIT 10 --
\`\`\`

### Step 3: Privilege Escalation

The \`role\` column contained values like \`user\`, \`admin\`, and \`superadmin\`. By authenticating as a superadmin account (whose MD5 hash I cracked in under a minute using hashcat), I gained full administrative access.

## Impact Assessment

The vulnerability chain allowed:
- **Authentication bypass** for any user account
- **Full database read access** including PII, billing data, and API keys
- **Privilege escalation** to superadmin via weak password hashing
- **Potential RCE** via SQL injection into system commands (not tested per scope)

This was rated as **Critical (CVSS 9.8)**.

## Remediation

I provided the client with the following remediation steps:

1. **Parameterized queries**: Replace all string concatenation with parameterized queries or an ORM
2. **Remove debug output**: Never expose SQL queries in API responses, even in development
3. **Password hashing**: Migrate from MD5 to bcrypt or Argon2id with per-user salts
4. **Input validation**: Implement strict input validation on all user-supplied data
5. **WAF rules**: Deploy SQL injection detection rules as a defense-in-depth measure

\`\`\`python
# Before (vulnerable)
query = f"SELECT * FROM users WHERE email = '{email}'"
cursor.execute(query)

# After (parameterized)
query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (email,))
\`\`\`

## Lessons Learned

This engagement reinforced several important principles:

- **Never trust user input** — even in fields that seem innocuous like email addresses
- **Defense in depth matters** — the debug output made discovery trivial, but the SQLi would have been found regardless
- **Password security is fundamental** — MD5 hashing without salting is effectively plaintext in 2026
- **Automated scanners aren't enough** — this vulnerability was in a JSON API endpoint that many automated tools would have missed

The client patched the vulnerability within 48 hours and implemented all recommended remediations within two weeks. A follow-up assessment confirmed the fixes were effective.`,
      tags: JSON.stringify(['SQL Injection', 'Penetration Testing', 'Web Security', 'OWASP']),
      published: true,
      publishedAt: new Date('2026-03-15'),
    },
    {
      title: 'Building Secure APIs with Next.js: A Practical Guide',
      slug: 'building-secure-apis-nextjs',
      excerpt: 'A comprehensive guide to building production-ready API routes in Next.js with proper authentication, input validation, rate limiting, and security headers.',
      content: `## Introduction

Next.js API routes make it easy to build full-stack applications, but the convenience can lead to security shortcuts. This guide covers the essential security measures every Next.js API should implement, with practical code examples you can use in your projects.

## Authentication with NextAuth.js

Every protected endpoint should verify the user's session before processing the request:

\`\`\`typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Proceed with authenticated logic
  return NextResponse.json({ data: 'protected content' });
}
\`\`\`

## Input Validation

Never trust client data. Validate and sanitize every input:

\`\`\`typescript
interface CreatePostInput {
  title: string;
  content: string;
  tags: string[];
}

function validatePost(body: unknown): CreatePostInput {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const { title, content, tags } = body as Record<string, unknown>;

  if (typeof title !== 'string' || title.trim().length < 1) {
    throw new Error('Title is required');
  }

  if (title.length > 200) {
    throw new Error('Title must be under 200 characters');
  }

  if (typeof content !== 'string' || content.trim().length < 10) {
    throw new Error('Content must be at least 10 characters');
  }

  if (!Array.isArray(tags) || tags.some(t => typeof t !== 'string')) {
    throw new Error('Tags must be an array of strings');
  }

  return {
    title: title.trim(),
    content: content.trim(),
    tags: tags.map(t => t.trim()).filter(Boolean),
  };
}
\`\`\`

## Rate Limiting

Protect your APIs from abuse with rate limiting:

\`\`\`typescript
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}
\`\`\`

For production, consider using Redis-backed rate limiting with sliding windows for better accuracy and multi-instance support.

## Security Headers

Add security headers via \`next.config.js\` or middleware:

\`\`\`typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}
\`\`\`

## Error Handling

Never leak internal details in error responses:

\`\`\`typescript
export async function POST(req: NextRequest) {
  try {
    // ... handler logic
  } catch (error) {
    // Log the full error internally
    console.error('API Error:', error);

    // Return a generic message to the client
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
\`\`\`

## File Upload Security

If your API accepts file uploads, validate thoroughly:

\`\`\`typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  // Process the validated file...
}
\`\`\`

## Conclusion

Security isn't a feature you add at the end — it's a practice you integrate from the start. These patterns cover the fundamentals, but always consider the specific threat model for your application and conduct regular security reviews as your codebase evolves.`,
      tags: JSON.stringify(['Next.js', 'API Security', 'TypeScript', 'Web Development']),
      published: true,
      publishedAt: new Date('2026-02-28'),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`${blogPosts.length} blog posts created`);

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
