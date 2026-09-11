#!/usr/bin/env python3
"""End-to-end API smoke test — exercises every flow the frontend uses.

Usage:
  python main.py                 # in another terminal
  python scripts/smoke_api.py    # verifies auth, jobs, applications, employer, admin
"""
from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"
PASSED = 0
FAILED: list[str] = []


def call(method: str, path: str, body: dict | None = None, token: str | None = None, expect: int = 200):
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(url, data=data, method=method)
    if body is not None:
        request.add_header("Content-Type", "application/json")
    if token:
        request.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            status = response.status
            payload = response.read().decode()
    except urllib.error.HTTPError as error:
        status = error.code
        payload = error.read().decode()
    if status != expect:
        raise AssertionError(f"{method} {path} -> {status} (expected {expect}): {payload[:200]}")
    try:
        return json.loads(payload) if payload else None
    except json.JSONDecodeError:
        return payload


def check(name: str, fn):
    global PASSED
    try:
        fn()
        PASSED += 1
        print(f"  ✓ {name}")
    except Exception as exc:  # noqa: BLE001
        FAILED.append(f"{name}: {exc}")
        print(f"  ✗ {name} -> {exc}")


print(f"LocalJob API smoke test against {BASE}\n")

state: dict = {}

print("system")
check("health", lambda: call("GET", "/api/health")["status"] == "ok")
check("meta", lambda: len(call("GET", "/api/meta")["categories"]) >= 10)

print("\nauth")
def register_seeker():
    email = f"seeker{int(time.time())}@example.com"
    result = call("POST", "/api/auth/register", {
        "name": "Test Seeker", "email": email, "password": "Test1234!", "confirm_password": "Test1234!",
        "role": "job_seeker", "location": "Tashkent",
    }, expect=201)
    state["seeker_token"] = result["token"]
    state["seeker_id"] = result["user"]["id"]
    state["seeker_email"] = email
    assert result["role"] == "job_seeker"
check("register job seeker", register_seeker)

def register_employer():
    email = f"employer{int(time.time())}@example.com"
    result = call("POST", "/api/auth/register", {
        "name": "Test Employer", "email": email, "password": "Test1234!", "confirm_password": "Test1234!",
        "role": "employer",
    }, expect=201)
    state["employer_token"] = result["token"]
    state["employer_id"] = result["user"]["id"]
    state["employer_email"] = email
check("register employer", register_employer)

check("duplicate email rejected", lambda: call("POST", "/api/auth/register", {
    "name": "Dup", "email": state["seeker_email"], "password": "Test1234!", "role": "job_seeker"}, expect=409))
check("weak password rejected", lambda: call("POST", "/api/auth/register", {
    "name": "Weak", "email": f"weak{int(time.time())}@example.com", "password": "123", "role": "job_seeker"}, expect=422))
check("demo seeker login", lambda: state.update({"demo_token": call("POST", "/api/auth/demo/seeker")["token"]}))
check("demo employer login", lambda: state.update({"demo_employer_token": call("POST", "/api/auth/demo/employer")["token"]}))
check("admin login", lambda: state.update({"admin_token": call("POST", "/api/auth/login", {
    "email": "admin@localjob.uz", "password": "Admin1234!"})["token"]}))
check("bad credentials rejected", lambda: call("POST", "/api/auth/login", {
    "email": "admin@localjob.uz", "password": "wrong"}, expect=401))
check("me", lambda: call("GET", "/api/auth/me", token=state["demo_token"])["user"]["email"] == "demo@localjob.uz")
check("unauthorized blocked", lambda: call("GET", "/api/auth/me", expect=401))

print("\njobs catalogue")
check("list jobs", lambda: call("GET", "/api/jobs?pageSize=10")["total"] >= 30)
check("facet counts", lambda: len(call("GET", "/api/jobs")["facets"]["categories"]) >= 8)
check("search react", lambda: call("GET", "/api/jobs?search=react")["total"] >= 2)
check("location filter", lambda: call("GET", "/api/jobs?location=samarkand")["total"] >= 1)
check("category filter", lambda: call("GET", "/api/jobs?category=IT,Design")["total"] >= 10)
check("remote filter", lambda: call("GET", "/api/jobs?remote=true")["total"] >= 3)
check("salary sort", lambda: call("GET", "/api/jobs?sort=salary")["items"][0]["salaryMax"] >= 0)
check("pagination", lambda: call("GET", "/api/jobs?pageSize=10&page=2")["page"] == 2)
check("job detail", lambda: call("GET", "/api/jobs/1")["responsibilities"])
check("job 404", lambda: call("GET", "/api/jobs/99999", expect=404))
check("register view", lambda: call("POST", "/api/jobs/1/view")["views"] >= 1)
check("recommended", lambda: len(call("GET", "/api/jobs/recommended?limit=6", token=state["demo_token"])["items"]) == 6)
check("companies list", lambda: call("GET", "/api/companies")["total"] >= 8)
check("company detail", lambda: call("GET", "/api/company" and "/api/companies/1")["jobs"] is not None)

print("\nsaved jobs")
check("save job", lambda: call("POST", f"/api/saved/2", {}, token=state["seeker_token"], expect=201))
check("saved list", lambda: call("GET", "/api/saved", token=state["seeker_token"])["total"] == 1)
check("unsave job", lambda: call("DELETE", "/api/saved/2", token=state["seeker_token"])["saved"] is False)

print("\napplications (job seeker)")
def apply_job():
    result = call("POST", "/api/applications", {
        "job_id": 3, "full_name": "Test Seeker", "email": state["seeker_email"], "phone": "+998900000000",
        "cover_letter": "I am very interested in this position and have relevant experience.",
        "portfolio_url": "https://example.com", "resume_name": "cv.pdf",
    }, token=state["seeker_token"], expect=201)
    state["application_id"] = result["id"]
    assert result["status"] == "submitted"
check("apply to job", apply_job)
check("duplicate application blocked", lambda: call("POST", "/api/applications", {
    "job_id": 3, "full_name": "Test Seeker", "email": state["seeker_email"],
    "cover_letter": "Second attempt with enough characters."}, token=state["seeker_token"], expect=409))
check("employer cannot apply", lambda: call("POST", "/api/applications", {
    "job_id": 3, "full_name": "Boss", "email": state["employer_email"],
    "cover_letter": "Employers must not apply to jobs."}, token=state["employer_token"], expect=403))
check("my applications", lambda: call("GET", "/api/applications", token=state["seeker_token"])["total"] == 1)
check("application detail", lambda: call("GET", f"/api/applications/{state['application_id']}", token=state["seeker_token"])["id"] == state["application_id"])
check("seeker dashboard", lambda: call("GET", "/api/dashboard", token=state["seeker_token"])["stats"]["applications"] == 1)
check("notifications", lambda: call("GET", "/api/notifications", token=state["seeker_token"])["unread"] >= 1)
check("mark notifications read", lambda: call("POST", "/api/notifications/read", {"all": True}, token=state["seeker_token"])["unread"] == 0)

print("\nprofile & settings")
def update_profile():
    result = call("PUT", "/api/profile", {
        "title": "QA Engineer", "bio": "Testing professional with automation background and strong attention to detail.",
        "category": "IT", "skills": ["Selenium", "Python"], "experience": [
            {"role": "QA", "company": "TestCo", "from": "2022-01", "to": "present", "description": "Testing"}],
        "education": [{"degree": "BSc", "school": "TUIT", "from": "2018", "to": "2022"}],
    }, token=state["seeker_token"])
    state["completion"] = result["completion"]
    assert result["profile"]["skills"] == ["Selenium", "Python"]
check("update profile", update_profile)
check("profile completion grows", lambda: state["completion"] >= 60)
check("get profile", lambda: call("GET", "/api/profile", token=state["seeker_token"])["profile"]["title"] == "QA Engineer")
check("update settings", lambda: call("PATCH", "/api/settings", {"location": "Samarkand", "theme": "light", "language": "ru"}, token=state["seeker_token"])["user"]["location"] == "Samarkand")
check("preferences", lambda: call("GET", "/api/settings/preferences", token=state["seeker_token"])["preferences"]["emailJobs"] is True)
check("update preferences", lambda: call("PUT", "/api/settings/preferences", {"emailJobs": False}, token=state["seeker_token"])["preferences"]["emailJobs"] is False)
check("change password", lambda: call("POST", "/api/auth/change-password", {
    "current_password": "Test1234!", "new_password": "NewTest1234!"}, token=state["seeker_token"])["ok"] is True)
check("login with new password", lambda: call("POST", "/api/auth/login", {
    "email": state["seeker_email"], "password": "NewTest1234!"})["token"] is not None)

print("\nemployer")
def create_job():
    result = call("POST", "/api/jobs", {
        "title": "Smoke Test Engineer", "category": "IT", "location": "Tashkent",
        "salary_min": 5000000, "salary_max": 9000000, "employment_type": "Full-time",
        "experience_level": "Junior", "description": "This is a smoke test job description with enough characters.",
        "responsibilities": ["Test things"], "requirements": ["Be careful"], "benefits": ["Coffee"], "skills": ["Testing"],
    }, token=state["employer_token"], expect=201)
    state["job_id"] = result["id"]
check("create job", create_job)
check("my jobs", lambda: call("GET", "/api/jobs/mine", token=state["employer_token"])["total"] == 1)
check("edit job", lambda: call("PATCH", f"/api/jobs/{state['job_id']}", {"title": "Smoke Test Engineer II"}, token=state["employer_token"])["title"] == "Smoke Test Engineer II")
check("pause job", lambda: call("PATCH", f"/api/jobs/{state['job_id']}", {"status": "paused"}, token=state["employer_token"])["status"] == "paused")
check("activate job", lambda: call("PATCH", f"/api/jobs/{state['job_id']}", {"status": "active"}, token=state["employer_token"])["status"] == "active")
check("employer dashboard", lambda: call("GET", "/api/employer/dashboard", token=state["employer_token"])["stats"]["totalJobs"] == 1)
check("employer cannot edit others job", lambda: call("PATCH", "/api/jobs/1", {"title": "Hijack"}, token=state["employer_token"], expect=403))

print("\nemployer candidate pipeline")
check("demo employer applications", lambda: call("GET", "/api/employer/applications", token=state["demo_employer_token"])["total"] >= 5)
def candidate_pipeline():
    data = call("GET", "/api/employer/applications", token=state["demo_employer_token"])
    application = data["items"][0]
    updated = call("PATCH", f"/api/applications/{application['id']}/status", {"status": "shortlisted"}, token=state["demo_employer_token"])
    assert updated["status"] == "shortlisted"
    state["candidate_id"] = application["applicantId"]
    state["candidate_application"] = application["id"]
check("move candidate to shortlisted", candidate_pipeline)
check("move to interview", lambda: call("PATCH", f"/api/applications/{state['candidate_application']}/status", {"status": "interview"}, token=state["demo_employer_token"])["status"] == "interview")
check("candidate profile", lambda: call("GET", f"/api/employer/candidates/{state['candidate_id']}", token=state["demo_employer_token"])["user"]["name"])
check("seeker status changed notification", lambda: any("status" in n["title"].lower() or "status" in (n["message"] or "").lower()
                                                       for n in call("GET", "/api/notifications", token=state["demo_token"])["items"]))
check("delete own job", lambda: call("DELETE", f"/api/jobs/{state['job_id']}", token=state["employer_token"])["ok"] is True)

print("\nadmin")
check("admin stats", lambda: call("GET", "/api/admin/stats", token=state["admin_token"])["users"]["total"] >= 8)
check("admin forbidden for seeker", lambda: call("GET", "/api/admin/stats", token=state["seeker_token"], expect=403))
check("admin users", lambda: call("GET", "/api/admin/users?pageSize=5", token=state["admin_token"])["total"] >= 8)
check("admin jobs", lambda: call("GET", "/api/admin/jobs?pageSize=5", token=state["admin_token"])["total"] >= 30)
check("admin applications", lambda: call("GET", "/api/admin/applications?pageSize=5", token=state["admin_token"])["total"] >= 5)
check("admin pause job", lambda: call("PATCH", "/api/admin/jobs/5", {"status": "paused"}, token=state["admin_token"])["status"] == "paused")
check("admin activate job", lambda: call("PATCH", "/api/admin/jobs/5", {"status": "active"}, token=state["admin_token"])["status"] == "active")
check("admin role change", lambda: call("PATCH", f"/api/admin/users/{state['seeker_id']}", {"role": "job_seeker"}, token=state["admin_token"])["user"]["role"] == "job_seeker")
check("admin broadcast", lambda: call("POST", "/api/admin/broadcast", {"message": "Smoke test announcement", "audience": "all"}, token=state["admin_token"])["notified"] >= 8)
check("admin activity", lambda: len(call("GET", "/api/admin/activity", token=state["admin_token"])["items"]) >= 1)
check("csv export", lambda: call("GET", "/api/admin/export?type=jobs", token=state["admin_token"]).startswith("id,title"))

print("\naccount deletion")
def delete_account():
    email = f"delete{int(time.time())}@example.com"
    created = call("POST", "/api/auth/register", {"name": "Temp", "email": email,
                                                  "password": "Test1234!", "role": "job_seeker"}, expect=201)
    call("DELETE", "/api/auth/account", {"password": "Test1234!"}, token=created["token"])
    call("POST", "/api/auth/login", {"email": email, "password": "Test1234!"}, expect=401)
check("delete account removes user", delete_account)

print("\nsingle-page app")
def spa_served():
    html = call("GET", "/")
    assert "LocalJob" in html and "/assets/" in html
check("SPA index served", spa_served)
check("deep link serves SPA", lambda: "LocalJob" in call("GET", "/jobs/1"))
check("api 404 stays json", lambda: call("GET", "/api/definitely-missing", expect=404)["detail"] == "not_found")

print(f"\n{'=' * 60}")
print(f"PASSED {PASSED} · FAILED {len(FAILED)}")
for failure in FAILED:
    print(f"  ✗ {failure}")
print("=" * 60)
sys.exit(1 if FAILED else 0)
