from django import template
import uuid

register = template.Library()


@register.inclusion_tag("partials/react_component.html")
def react_component(component_name, **kwargs):
    return {"component_name": component_name, "uuid": uuid.uuid4(), "props": kwargs}
