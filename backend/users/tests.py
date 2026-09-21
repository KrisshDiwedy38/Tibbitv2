from django.test import TestCase
from django.urls import resolve
from rest_framework.test import APIClient, APITestCase
from .views import WaitlistCreateView, ContactFounderView, ReportBugView


class ReservedRoutesNotShadowedTestCase(TestCase):
    """
    The catch-all `(?P<username>[\\w.@+-]+)/?$` route used to be registered
    before waitlist/contact/report-bug, so it matched those path segments as
    a "username" and routed them to the (GET-only) public profile view
    instead — POSTs to all three 405'd in production.

    Resolved via django.urls.resolve rather than a live POST for contact/
    report-bug specifically because those views send a real email through
    Resend with no test-mode gate — a live request here would actually
    email the founder inbox on every test run.
    """

    def test_waitlist_resolves_to_waitlist_view(self):
        match = resolve('/api/users/waitlist/')
        self.assertIs(match.func.view_class, WaitlistCreateView)

    def test_contact_resolves_to_contact_view(self):
        match = resolve('/api/users/contact/')
        self.assertIs(match.func.view_class, ContactFounderView)

    def test_report_bug_resolves_to_report_bug_view(self):
        match = resolve('/api/users/report-bug/')
        self.assertIs(match.func.view_class, ReportBugView)


class WaitlistCreateTestCase(APITestCase):
    def test_waitlist_signup_succeeds(self):
        resp = APIClient().post('/api/users/waitlist/', {
            'email': 'newstudent@somecollege.edu',
            'university_name': 'Some College',
        }, format='json')
        self.assertEqual(resp.status_code, 201, resp.data)
