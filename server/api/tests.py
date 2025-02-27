from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Item


class ItemModelTests(TestCase):
    """
    Item 모델 테스트
    """
    def test_create_item(self):
        """
        Item 생성 테스트
        """
        item = Item.objects.create(
            name="Test Item",
            description="Test Description"
        )
        self.assertEqual(item.name, "Test Item")
        self.assertEqual(item.description, "Test Description")


class ItemAPITests(TestCase):
    """
    Item API 테스트
    """
    def setUp(self):
        self.client = APIClient()
        self.item_data = {
            'name': 'Test API Item',
            'description': 'Test API Description'
        }
        self.item = Item.objects.create(
            name="Existing Item",
            description="Existing Description"
        )

    def test_get_all_items(self):
        """
        모든 Item 조회 테스트
        """
        response = self.client.get(reverse('item-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_item_api(self):
        """
        Item 생성 API 테스트
        """
        response = self.client.post(
            reverse('item-list'),
            self.item_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Item.objects.count(), 2)
